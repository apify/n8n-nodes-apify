import {
	IDataObject,
	IDisplayOptions,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeProperties,
	INodePropertyOptions,
	JsonObject,
	NodeApiError,
	NodeOperationError,
	ResourceMapperFields,
} from 'n8n-workflow';
import { SERVER_ACTOR_REQUEST_TIMEOUT_MS } from '../helpers/consts';
import { apiRequest, escapeHtml } from './genericFunctions';
import {
	getEndpointFields,
	getEndpointOperation,
	HTTP_METHODS,
	parseEndpointValue,
	parseFieldId,
	parseOpenApiDocument,
	parseOpenApiEndpoints,
} from './serverActorOpenApi';

/**
 * Server Actors answer HTTP requests at their `standbyUrl` instead of starting a run (the API
 * still uses the old "standby" names). The Send Server Actor request operation sends one request
 * to the chosen endpoint and returns `{ status, contentType, body }`.
 *
 * Every request may be charged, so it is never retried, and no error message suggests retrying.
 */

export const CUSTOM_ENDPOINT = '__custom__';
// Placeholder endpoint values. Executing with one of them fails with its message.
export const NO_ACTOR_SELECTED = '__noActor__';
export const NO_SERVER_INTERFACE = '__noServer__';
export const MCP_ONLY = '__mcpOnly__';

const MESSAGES = {
	noServerInterface:
		'This Actor has no server interface. Use the Run an Actor operation to start a run instead.',
	mcpOnly:
		"This Actor is an MCP server. Use n8n's MCP Client Tool node (or MCP Client node) with the Actor's MCP URL instead. Their default timeout is 60 s, so raise it for slow tools.",
	noEndpoint: 'Choose an endpoint.',
	timeout:
		"The Actor didn't answer in time (Apify waits up to 300 s). The request may still have been charged.",
	binary:
		'The Actor returned a binary response, which is not supported yet. The request may still have been charged.',
	charged: 'The request may still have been charged.',
};

interface ServerActor {
	id: string;
	standbyUrl?: string;
	actorStandby?: { isEnabled?: boolean };
}

interface ActorBuild {
	actorDefinition?: { webServerSchema?: unknown; webServerMcpPath?: string };
}

async function getActor(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	actorId: string,
): Promise<ServerActor> {
	const { data } = await apiRequest.call(this, { method: 'GET', uri: `/v2/acts/${actorId}` });
	return data;
}

async function getDefaultBuild(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	actorId: string,
): Promise<ActorBuild> {
	const { data } = await apiRequest.call(this, {
		method: 'GET',
		uri: `/v2/acts/${actorId}/builds/default`,
	});
	return data ?? {};
}

/** Returns the standby URL's origin only if it is an `https://*.apify.actor` host. */
function getServerOrigin(actor: ServerActor | undefined): string | undefined {
	if (!actor?.actorStandby?.isEnabled || typeof actor.standbyUrl !== 'string') return undefined;
	try {
		const url = new URL(actor.standbyUrl);
		// The connection's token goes with the request, so never send it anywhere else.
		if (url.protocol !== 'https:' || !url.hostname.endsWith('.apify.actor')) return undefined;
		return url.origin;
	} catch {
		return undefined;
	}
}

function readmeUrl(actorId: string): string {
	return `https://console.apify.com/actors/${encodeURIComponent(actorId)}/information/latest/readme`;
}

function getSelectedActorId(this: ILoadOptionsFunctions): string {
	const locator = this.getNodeParameter('actorId', null) as { value?: unknown } | null;
	// An expression that can't be resolved at design time (e.g. `$fromAI()`) arrives empty too.
	if (!locator?.value) return '';
	return this.getNodeParameter('actorId', '', { extractValue: true }) as string;
}

/** loadOptions for the Endpoint dropdown: the OpenAPI paths of the default build, plus Custom path. */
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

	const actor = await getActor.call(this, actorId);
	if (!getServerOrigin(actor)) {
		return [
			{
				name: 'This Actor Has No Server Interface',
				value: NO_SERVER_INTERFACE,
				description: MESSAGES.noServerInterface,
			},
		];
	}

	const build = await getDefaultBuild.call(this, actorId);
	const document = parseOpenApiDocument(build.actorDefinition?.webServerSchema);
	if (!document && build.actorDefinition?.webServerMcpPath) {
		return [
			{ name: 'This Actor Is an MCP Server', value: MCP_ONLY, description: MESSAGES.mcpOnly },
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

/** resourceMapper for the selected endpoint's typed path, query and body fields. */
export async function getServerActorEndpointFields(
	this: ILoadOptionsFunctions,
): Promise<ResourceMapperFields> {
	const actorId = getSelectedActorId.call(this);
	const endpoint = parseEndpointValue((this.getNodeParameter('endpoint', '') as string) || '');
	if (!actorId || !endpoint) {
		return { fields: [], emptyFieldsNotice: 'Choose an Actor and an endpoint to load its fields.' };
	}

	let fields;
	try {
		const build = await getDefaultBuild.call(this, actorId);
		const document = parseOpenApiDocument(build.actorDefinition?.webServerSchema);
		fields = getEndpointFields(document, endpoint.method, endpoint.path);
	} catch (error) {
		// n8n's editor drops errors thrown here, so show the reason as a notice. It's rendered as HTML.
		return {
			fields: [],
			emptyFieldsNotice: `Could not load the endpoint's fields: ${escapeHtml((error as Error).message)}`,
		};
	}

	if (!fields) {
		return {
			fields: [],
			emptyFieldsNotice:
				"This endpoint isn't in the Actor's OpenAPI definition. Choose another endpoint or use Custom Path.",
		};
	}
	if (fields.length === 0) {
		return { fields: [], emptyFieldsNotice: 'This endpoint takes no parameters.' };
	}
	return { fields };
}

/** The endpoint fields that follow the Actor picker, shown under `displayOptions.show`. */
export function serverActorProperties(show: IDisplayOptions['show']): INodeProperties[] {
	const withShow = (extra: IDisplayOptions['show'] = {}): IDisplayOptions => ({
		show: { ...show, ...extra },
	});

	return [
		{
			displayName: 'Endpoint Name or ID',
			name: 'endpoint',
			type: 'options',
			required: true,
			default: '',
			description:
				'The endpoint to send the request to, from the Actor\'s OpenAPI definition. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			typeOptions: {
				loadOptionsMethod: 'listServerActorEndpoints',
				loadOptionsDependsOn: ['actorId.value'],
			},
			displayOptions: withShow(),
		},
		{
			displayName: 'Method',
			name: 'endpointMethod',
			type: 'options',
			default: 'GET',
			options: HTTP_METHODS.map((method) => ({ name: method, value: method })),
			displayOptions: withShow({ endpoint: [CUSTOM_ENDPOINT] }),
		},
		{
			displayName: 'Path',
			name: 'endpointPath',
			type: 'string',
			default: '/',
			placeholder: '/search',
			description: "Path on the Actor's server, starting with /",
			displayOptions: withShow({ endpoint: [CUSTOM_ENDPOINT] }),
		},
		{
			displayName: 'Query Parameters',
			name: 'endpointQuery',
			type: 'json',
			default: '{}',
			description: 'Query parameters as a JSON object, e.g. {"limit": 10}',
			displayOptions: withShow({ endpoint: [CUSTOM_ENDPOINT] }),
		},
		{
			displayName: 'Body',
			name: 'endpointBody',
			type: 'json',
			default: '{}',
			description: 'JSON request body. Not sent with GET requests.',
			displayOptions: withShow({
				endpoint: [CUSTOM_ENDPOINT],
				endpointMethod: ['POST', 'PUT', 'PATCH', 'DELETE'],
			}),
		},
		{
			displayName: 'Parameters',
			name: 'endpointParameters',
			type: 'resourceMapper',
			noDataExpression: true,
			default: {
				mappingMode: 'defineBelow',
				value: null,
			},
			typeOptions: {
				loadOptionsDependsOn: ['actorId.value', 'endpoint'],
				resourceMapper: {
					resourceMapperMethod: 'getServerActorEndpointFields',
					mode: 'add',
					valuesLabel: 'Parameters',
					fieldWords: {
						singular: 'parameter',
						plural: 'parameters',
					},
					addAllFields: true,
					multiKeyMatch: false,
					supportAutoMap: false,
				},
			},
			displayOptions: {
				show: { ...show },
				// Shown only once a documented endpoint is chosen.
				hide: { endpoint: ['', CUSTOM_ENDPOINT, NO_ACTOR_SELECTED, NO_SERVER_INTERFACE, MCP_ONLY] },
			},
		},
	];
}

function parseJson(
	this: IExecuteFunctions,
	raw: unknown,
	field: string,
	i: number,
	allowArray: boolean,
): unknown {
	let value = raw;
	if (typeof raw === 'string') {
		if (!raw.trim()) return {};
		try {
			value = JSON.parse(raw);
		} catch {
			value = undefined;
		}
	}
	const isPlainObject = typeof value === 'object' && value !== null && !Array.isArray(value);
	if (isPlainObject || (allowArray && Array.isArray(value))) return value;
	throw new NodeOperationError(
		this.getNode(),
		`${field} must be a JSON ${allowArray ? 'object or array' : 'object'}`,
		{ itemIndex: i },
	);
}

interface ServerActorRequest {
	method: string;
	path: string;
	query: IDataObject;
	body?: unknown;
}

/** Reads the endpoint, its typed field values or the Custom Path fields into one request. */
function getRequest(this: IExecuteFunctions, i: number, endpointValue: string): ServerActorRequest {
	if (endpointValue === CUSTOM_ENDPOINT) {
		const method = (this.getNodeParameter('endpointMethod', i, 'GET') as string).toUpperCase();
		const path = (this.getNodeParameter('endpointPath', i, '/') as string).trim();
		const query = parseJson.call(
			this,
			this.getNodeParameter('endpointQuery', i, '{}'),
			'Query Parameters',
			i,
			false,
		) as IDataObject;
		const body =
			method === 'GET'
				? undefined
				: parseJson.call(this, this.getNodeParameter('endpointBody', i, '{}'), 'Body', i, true);
		// One leading slash: `//host/x` would read as a protocol-relative URL to some tools.
		return { method, path: `/${path.replace(/^\/+/, '')}`, query, body };
	}

	const endpoint = parseEndpointValue(endpointValue);
	if (!endpoint) {
		throw new NodeOperationError(
			this.getNode(),
			`Unknown endpoint "${endpointValue}". Use the form "POST /path" or choose Custom Path.`,
			{ itemIndex: i },
		);
	}

	// Reading `.value` makes n8n validate the fields and parse the JSON of object/array fields.
	const values = (this.getNodeParameter('endpointParameters.value', i, {}) ?? {}) as IDataObject;
	const pathParams: IDataObject = {};
	const query: IDataObject = {};
	let body: IDataObject | unknown[] | undefined;
	for (const [id, value] of Object.entries(values)) {
		// Leave out unset fields so the Actor's own defaults apply.
		if (value === null || value === undefined) continue;
		const { location, name } = parseFieldId(id);
		if (location === 'path') pathParams[name] = value;
		else if (location === 'query') query[name] = value;
		else if (location === 'wholeBody') body = value as IDataObject;
		else body = { ...(body as IDataObject), [name]: value };
	}

	// Fill path parameters such as /items/{itemId}.
	const path = endpoint.path.replace(/\{([^}]+)\}/g, (_, name: string) => {
		const value = pathParams[name];
		if (value === undefined || value === '') {
			throw new NodeOperationError(this.getNode(), `Missing value for path parameter "${name}"`, {
				itemIndex: i,
			});
		}
		return encodeURIComponent(String(value));
	});

	return {
		method: endpoint.method,
		path,
		query,
		body: endpoint.method === 'GET' ? undefined : (body ?? {}),
	};
}

/**
 * Builds the query string. Arrays are repeated (`?a=1&a=2`) unless the OpenAPI parameter has
 * `explode: false` (`?a=1,2`); objects are sent as JSON.
 */
function buildQueryString(query: IDataObject, explodeFalse: Set<string>): string {
	const params = new URLSearchParams();
	for (const [name, value] of Object.entries(query)) {
		if (Array.isArray(value)) {
			if (explodeFalse.has(name)) params.append(name, value.map(String).join(','));
			else
				value.forEach((item) =>
					params.append(name, typeof item === 'object' ? JSON.stringify(item) : String(item)),
				);
		} else {
			params.append(name, typeof value === 'object' ? JSON.stringify(value) : String(value));
		}
	}
	const queryString = params.toString();
	return queryString ? `?${queryString}` : '';
}

/** Names of the endpoint's array query parameters that are sent comma-separated. */
async function getNonExplodedQueryParams(
	this: IExecuteFunctions,
	actorId: string,
	endpointValue: string,
	query: IDataObject,
): Promise<Set<string>> {
	const endpoint = parseEndpointValue(endpointValue);
	// Only arrays depend on the style, so skip the build lookup when there are none.
	if (!endpoint || !Object.values(query).some(Array.isArray)) return new Set();
	const build = await getDefaultBuild.call(this, actorId);
	const document = parseOpenApiDocument(build.actorDefinition?.webServerSchema);
	const operation = getEndpointOperation(document, endpoint.method, endpoint.path);
	return new Set(
		(operation?.parameters ?? [])
			.filter((parameter) => parameter.in === 'query' && parameter.explode === false)
			.map((parameter) => parameter.name),
	);
}

const TEXT_CONTENT_TYPES =
	/^(text\/|application\/(.+\+)?(json|xml|javascript|ecmascript|x-ndjson|ndjson|x-www-form-urlencoded|yaml|x-yaml|graphql|csv)$)/;

function isJsonContentType(contentType: string): boolean {
	return /^application\/(.+\+)?json$/.test(contentType);
}

function decodeUtf8(buffer: Buffer): string | undefined {
	try {
		return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
	} catch {
		return undefined;
	}
}

/**
 * Decodes a raw response body: JSON is parsed, other text stays a string, and binary data
 * returns `{ binary: true }`. A body without a content type counts as text if it is valid UTF-8.
 */
export function decodeResponseBody(
	raw: unknown,
	contentType: string,
): { body: unknown } | { binary: true } {
	let buffer: Buffer;
	if (Buffer.isBuffer(raw)) buffer = raw;
	else if (raw instanceof ArrayBuffer) buffer = Buffer.from(raw);
	else if (typeof raw === 'string') buffer = Buffer.from(raw, 'utf8');
	else return { body: raw ?? null };

	if (buffer.length === 0) return { body: null };
	if (contentType && !TEXT_CONTENT_TYPES.test(contentType)) return { binary: true };

	const text = decodeUtf8(buffer);
	if (text === undefined) return { binary: true };
	if (!contentType || isJsonContentType(contentType)) {
		try {
			return { body: JSON.parse(text) };
		} catch {
			return { body: text };
		}
	}
	return { body: text };
}

function asString(value: unknown): string | undefined {
	return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

/**
 * Finds the Actor's own error message in a response body: Apify's `{ error: { type, message } }`,
 * a flat `{ error, code }` (e.g. Web Fetch), `{ message }`, `{ detail }`, or plain text.
 */
export function getErrorFromBody(body: unknown): { message?: string; type?: string } {
	if (typeof body === 'string') return { message: asString(body)?.slice(0, 1000) };
	if (!body || typeof body !== 'object' || Array.isArray(body)) return {};
	const data = body as IDataObject;
	const nested = data.error && typeof data.error === 'object' ? (data.error as IDataObject) : {};
	return {
		message:
			asString(nested.message) ??
			asString(data.error) ??
			asString(data.message) ??
			asString(data.detail) ??
			asString(data.title),
		type: asString(nested.type) ?? asString(data.code) ?? asString(data.type),
	};
}

function isTimeoutError(error: unknown): boolean {
	const candidates = [error, (error as { cause?: unknown })?.cause];
	return candidates.some((candidate) => {
		const code = (candidate as { code?: unknown })?.code;
		return code === 'ECONNABORTED' || code === 'ETIMEDOUT' || code === 'ESOCKETTIMEDOUT';
	});
}

/** Send Server Actor request: sends one request to the Actor's server. */
export async function callServerActor(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const actorId = this.getNodeParameter('actorId', i, undefined, { extractValue: true }) as string;
	const endpointValue = (this.getNodeParameter('endpoint', i, '') as string) || '';

	const placeholderMessages: Record<string, string> = {
		'': MESSAGES.noEndpoint,
		[NO_ACTOR_SELECTED]: MESSAGES.noEndpoint,
		[NO_SERVER_INTERFACE]: MESSAGES.noServerInterface,
		[MCP_ONLY]: MESSAGES.mcpOnly,
	};
	if (endpointValue in placeholderMessages) {
		throw new NodeOperationError(this.getNode(), placeholderMessages[endpointValue], {
			itemIndex: i,
		});
	}

	const request = getRequest.call(this, i, endpointValue);

	const origin = getServerOrigin(await getActor.call(this, actorId));
	if (!origin) {
		throw new NodeOperationError(this.getNode(), MESSAGES.noServerInterface, { itemIndex: i });
	}

	const explodeFalse = await getNonExplodedQueryParams.call(
		this,
		actorId,
		endpointValue,
		request.query,
	);
	const url = `${origin}${request.path}${buildQueryString(request.query, explodeFalse)}`;
	// A path like `//other.host` must not move the request (and the token) to another host.
	if (new URL(url).origin !== origin) {
		throw new NodeOperationError(this.getNode(), `Invalid path "${request.path}"`, {
			itemIndex: i,
		});
	}

	let response: { body?: unknown; headers?: IDataObject; statusCode?: number };
	try {
		response = await apiRequest.call(this, {
			method: request.method as (typeof HTTP_METHODS)[number],
			uri: url,
			body: request.body as IDataObject,
			json: false,
			encoding: 'arraybuffer',
			returnFullResponse: true,
			// Read the Actor's own error responses instead of n8n's generic ones.
			ignoreHttpStatusErrors: true,
			// Above Apify's 300 s, so its 504 arrives before n8n gives up.
			timeout: SERVER_ACTOR_REQUEST_TIMEOUT_MS,
			disableRetries: true,
		});
	} catch (error) {
		if (isTimeoutError(error)) {
			throw new NodeApiError(
				this.getNode(),
				{ message: MESSAGES.timeout },
				{
					message: MESSAGES.timeout,
					description: `No response within ${SERVER_ACTOR_REQUEST_TIMEOUT_MS / 1000} s.`,
					itemIndex: i,
				},
			);
		}
		// apiRequest already throws NodeApiError, and re-wrapping one returns it unchanged.
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}

	const status = Number(response?.statusCode ?? 200);
	const headers = response?.headers ?? {};
	const contentType = String(headers['content-type'] ?? '')
		.split(';')[0]
		.trim()
		.toLowerCase();
	const decoded = decodeResponseBody(response?.body, contentType);

	if (status >= 400) {
		const body = 'body' in decoded ? decoded.body : undefined;
		const { message, type } = getErrorFromBody(body);
		const timedOut = status === 504;
		const errorMessage = timedOut
			? MESSAGES.timeout
			: (message ?? `The Actor answered with status ${status}`);
		const details = [`Status ${status}`, type ? `type ${type}` : undefined]
			.filter(Boolean)
			.join(', ');
		const description = timedOut
			? `${details}${message ? `: ${message}` : ''}`
			: `${details}. ${MESSAGES.charged}`;
		throw new NodeApiError(
			this.getNode(),
			{ message: errorMessage, httpCode: String(status) },
			{
				message: errorMessage,
				description,
				httpCode: String(status),
				itemIndex: i,
			},
		);
	}

	if ('binary' in decoded) {
		throw new NodeOperationError(this.getNode(), MESSAGES.binary, {
			description: `Content type: ${contentType || 'unknown'}`,
			itemIndex: i,
		});
	}

	return {
		json: {
			status,
			contentType: contentType || null,
			body: decoded.body as IDataObject,
		},
	};
}
