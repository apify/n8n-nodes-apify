import { IExecuteFunctions, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { APIFY_ACTOR_HOST_SUFFIX, APIFY_CONSOLE_URL } from '../helpers/consts';
import { getDefaultBuild } from './executeActor';
import { apiRequest } from './genericFunctions';
import { parseOpenApiDocument, parseOpenApiEndpoints } from './serverActorOpenApi';

/**
 * Server Actors answer HTTP requests at their `standbyUrl` instead of starting a run (the API
 * still uses the old "standby" names).
 *
 * Every request may be charged, so it is never retried, and no message suggests retrying.
 */

const CHARGED = 'The request may still have been charged.';

export const SERVER_ACTOR_MESSAGES = {
	noServerInterface:
		'This Actor has no server interface. Use the Run an Actor operation to start a run instead.',
	mcpOnly:
		"This Actor is an MCP server. Use n8n's MCP Client Tool node (or MCP Client node) with the Actor's MCP URL instead. Their default timeout is 60 s, so raise it for slow tools.",
	noEndpoint: 'Choose an endpoint.',
	timeout: `The Actor didn't answer in time (Apify waits up to 300 s). ${CHARGED}`,
	binary: `The Actor returned a binary response, which is not supported yet. ${CHARGED}`,
	charged: CHARGED,
};

// Endpoint values that aren't an endpoint. Custom Path takes a method and path; the rest only
// carry a message, and executing with one of them fails with it.
export const CUSTOM_ENDPOINT = '__custom__';
export const NO_ACTOR_SELECTED = '__noActor__';
export const NO_SERVER_INTERFACE = '__noServer__';
export const MCP_ONLY = '__mcpOnly__';

interface ServerActor {
	standbyUrl?: string;
	actorStandby?: { isEnabled?: boolean };
}

interface ServerActorBuild {
	actorDefinition?: { webServerSchema?: unknown; webServerMcpPath?: string };
}

/**
 * The origin of the Actor's server, or `undefined` when the Actor has no server interface. Only
 * `https://*.apify.actor` hosts count: the request carries the connection's token.
 */
export async function getServerActorOrigin(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	actorId: string,
): Promise<string | undefined> {
	const { data: actor } = (await apiRequest.call(this, {
		method: 'GET',
		uri: `/v2/acts/${actorId}`,
	})) as { data?: ServerActor };
	if (!actor?.actorStandby?.isEnabled || typeof actor.standbyUrl !== 'string') return undefined;
	try {
		const url = new URL(actor.standbyUrl);
		if (url.protocol !== 'https:' || !url.hostname.endsWith(APIFY_ACTOR_HOST_SUFFIX)) {
			return undefined;
		}
		return url.origin;
	} catch {
		return undefined;
	}
}

type OpenApiDocument = ReturnType<typeof parseOpenApiDocument>;
// One OpenAPI lookup per Actor per execution: every item of a run shares the same context object.
const documentCache = new WeakMap<object, Map<string, Promise<OpenApiDocument>>>();

/** The OpenAPI document (`webServerSchema`) of the Actor's default build, if it has one. */
export async function getServerActorOpenApi(
	this: IExecuteFunctions,
	actorId: string,
): Promise<OpenApiDocument> {
	const byActor = documentCache.get(this) ?? new Map<string, Promise<OpenApiDocument>>();
	documentCache.set(this, byActor);
	let document = byActor.get(actorId);
	if (!document) {
		document = (getDefaultBuild.call(this, actorId) as Promise<ServerActorBuild>).then((build) =>
			parseOpenApiDocument(build.actorDefinition?.webServerSchema),
		);
		byActor.set(actorId, document);
	}
	return await document;
}

/** The Actor ID chosen in the node, or '' when none is (or an expression can't be resolved yet). */
function getSelectedActorId(this: ILoadOptionsFunctions): string {
	const locator = this.getNodeParameter('actorId', null) as { value?: unknown } | null;
	if (!locator?.value) return '';
	return this.getNodeParameter('actorId', '', { extractValue: true }) as string;
}

function readmeUrl(actorId: string): string {
	return `${APIFY_CONSOLE_URL}/actors/${encodeURIComponent(actorId)}/information/latest/readme`;
}

/** loadOptions for the Endpoint dropdown: the OpenAPI paths of the default build, plus Custom Path. */
export async function listServerActorEndpoints(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const actorId = getSelectedActorId.call(this);
	if (!actorId) {
		return [
			{
				name: 'Select an Actor First',
				value: NO_ACTOR_SELECTED,
				description:
					'The Actor must be chosen from the list, by URL or by ID, not by an expression',
			},
		];
	}

	if (!(await getServerActorOrigin.call(this, actorId))) {
		return [
			{
				name: 'This Actor Has No Server Interface',
				value: NO_SERVER_INTERFACE,
				description: SERVER_ACTOR_MESSAGES.noServerInterface,
			},
		];
	}

	const build = (await getDefaultBuild.call(this, actorId)) as ServerActorBuild;
	const document = parseOpenApiDocument(build.actorDefinition?.webServerSchema);
	if (!document && build.actorDefinition?.webServerMcpPath) {
		return [
			{
				name: 'This Actor Is an MCP Server',
				value: MCP_ONLY,
				description: SERVER_ACTOR_MESSAGES.mcpOnly,
			},
		];
	}

	const endpoints = parseOpenApiEndpoints(document);
	return [
		...endpoints,
		{
			name: 'Custom Path',
			value: CUSTOM_ENDPOINT,
			description: endpoints.length
				? 'Send a request to a path that is not in the list'
				: `This Actor doesn't document its endpoints. Find the method and path in its README: ${readmeUrl(actorId)}`,
		},
	];
}
