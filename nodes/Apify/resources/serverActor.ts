import {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeProperties,
	INodePropertyOptions,
	JsonObject,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { apiRequest } from './genericFunctions';

/**
 * Server Actors are Actors with the server interface enabled (`actorStandby.isEnabled`; the API keeps
 * the old "standby" names). They answer HTTP requests at their `standbyUrl` instead of starting a run.
 * This module is shared by the "Endpoint" interface of Run actor and the "Call Server Actor" operation.
 */

export const CUSTOM_ENDPOINT = '__custom__';
export const NO_SERVER_INTERFACE = '__none__';

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;
// Paths many Actors expose for the platform or for docs, not for callers.
const HIDDEN_PATHS = new Set([
	'/health',
	'/healthz',
	'/openapi.json',
	'/openapi.yaml',
	'/docs',
	'/favicon.ico',
	'/robots.txt',
]);
const DEFAULT_TIMEOUT_SECS = 300; // the platform cuts off requests with no response after 300 s

/** Turns an OpenAPI document (object or JSON string) into endpoint options, e.g. `GET /items`. */
export function parseOpenApiEndpoints(schema: unknown): INodePropertyOptions[] {
	let document = schema;
	if (typeof document === 'string') {
		try {
			document = JSON.parse(document);
		} catch {
			return [];
		}
	}
	const paths = (document as IDataObject | undefined)?.paths;
	if (!paths || typeof paths !== 'object') return [];

	const endpoints: INodePropertyOptions[] = [];
	for (const [path, operations] of Object.entries(paths as IDataObject)) {
		if (HIDDEN_PATHS.has(path) || !operations || typeof operations !== 'object') continue;
		for (const method of HTTP_METHODS) {
			const operation = (operations as IDataObject)[method] as IDataObject | undefined;
			if (!operation) continue;
			const value = `${method.toUpperCase()} ${path}`;
			endpoints.push({
				name: value,
				value,
				description: (operation.summary || operation.description || '') as string,
			});
		}
	}
	return endpoints;
}

/** loadOptions method for the endpoint dropdown; reloads whenever the Actor changes. */
export async function listServerActorEndpoints(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const actorId = this.getCurrentNodeParameter('actorId', { extractValue: true }) as string;
	if (!actorId) {
		return [{ name: 'Select an Actor First', value: NO_SERVER_INTERFACE }];
	}

	const { data: actor } = await apiRequest.call(this, {
		method: 'GET',
		uri: `/v2/acts/${actorId}`,
	});
	if (!actor?.actorStandby?.isEnabled) {
		return [
			{
				name: 'This Actor Has No Server Interface',
				value: NO_SERVER_INTERFACE,
				description: 'Use the Input interface to start a run instead',
			},
		];
	}

	const { data: build } = await apiRequest.call(this, {
		method: 'GET',
		uri: `/v2/acts/${actorId}/builds/default`,
	});
	const endpoints = parseOpenApiEndpoints(build?.actorDefinition?.webServerSchema);

	return [
		...endpoints,
		{
			name: 'Custom Path…',
			value: CUSTOM_ENDPOINT,
			description: endpoints.length
				? 'Call a path that is not in the OpenAPI definition'
				: "This Actor has no OpenAPI definition. Enter the method and path from the Actor's README.",
		},
	];
}

/** The endpoint fields, shown under `show` (the operation, plus the interface for Run actor). */
export function serverEndpointProperties(
	show: INodeProperties['displayOptions'],
): INodeProperties[] {
	const withShow = (extra: Record<string, string[]> = {}): INodeProperties['displayOptions'] => ({
		show: { ...show?.show, ...extra },
	});

	return [
		{
			displayName: 'Endpoint Name or ID',
			name: 'endpoint',
			type: 'options',
			required: true,
			default: '',
			description:
				'The Server Actor endpoint to call, from its OpenAPI definition. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			typeOptions: {
				loadOptionsMethod: 'listServerActorEndpoints',
				loadOptionsDependsOn: ['actorId.value'],
			},
			displayOptions: withShow(),
		},
		{
			displayName: 'Method',
			name: 'customMethod',
			type: 'options',
			default: 'GET',
			options: HTTP_METHODS.map((method) => ({
				name: method.toUpperCase(),
				value: method.toUpperCase(),
			})),
			displayOptions: withShow({ endpoint: [CUSTOM_ENDPOINT] }),
		},
		{
			displayName: 'Path',
			name: 'customPath',
			type: 'string',
			default: '/',
			placeholder: '/search',
			description: "Path on the Actor's server URL",
			displayOptions: withShow({ endpoint: [CUSTOM_ENDPOINT] }),
		},
		{
			displayName: 'Query Parameters',
			name: 'queryParameters',
			type: 'json',
			default: '{}',
			description:
				'Query parameters as a JSON object. Values for path parameters like {itemId} are taken from here too.',
			displayOptions: withShow(),
		},
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: '{}',
			description: 'JSON request body. Ignored for GET requests.',
			displayOptions: withShow(),
		},
		{
			displayName: 'Request Timeout',
			name: 'requestTimeout',
			type: 'number',
			default: DEFAULT_TIMEOUT_SECS,
			description:
				'How long to wait for the response, in seconds. The platform stops waiting after 300 s if the Actor has not started responding.',
			typeOptions: { minValue: 1 },
			displayOptions: withShow(),
		},
	];
}

function parseJsonObject(
	this: IExecuteFunctions,
	raw: unknown,
	field: string,
	i: number,
): IDataObject {
	if (raw && typeof raw === 'object' && !Array.isArray(raw)) return raw as IDataObject;
	const text = typeof raw === 'string' ? raw.trim() : '';
	if (!text) return {};
	try {
		const parsed = JSON.parse(text);
		if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
	} catch {
		// fall through
	}
	throw new NodeOperationError(this.getNode(), `${field} must be a JSON object`, { itemIndex: i });
}

function errorMessageFromBody(
	body: unknown,
): { message: string; description?: string } | undefined {
	if (typeof body === 'string' && body.trim()) return { message: body.trim().slice(0, 500) };
	if (!body || typeof body !== 'object') return undefined;
	const data = body as IDataObject;
	// The Actor's own error shape, e.g. Web Fetch's { code, error }.
	if (typeof data.error === 'string') {
		return {
			message: data.error,
			description: typeof data.code === 'string' ? `Actor error code: ${data.code}` : undefined,
		};
	}
	// The platform's shape: { error: { type, message } }.
	const nested = data.error as IDataObject | undefined;
	if (typeof nested?.message === 'string') {
		return {
			message: nested.message,
			description: typeof nested.type === 'string' ? `Error type: ${nested.type}` : undefined,
		};
	}
	return undefined;
}

/** Calls the chosen endpoint of the item's Server Actor and returns `{ status, contentType, body }`. */
export async function callServerActor(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const actorId = this.getNodeParameter('actorId', i, undefined, { extractValue: true }) as string;
	const endpoint = this.getNodeParameter('endpoint', i, '') as string;
	const timeoutSecs = this.getNodeParameter('requestTimeout', i, DEFAULT_TIMEOUT_SECS) as number;
	const query = parseJsonObject.call(
		this,
		this.getNodeParameter('queryParameters', i, '{}'),
		'Query Parameters',
		i,
	);
	const body = parseJsonObject.call(this, this.getNodeParameter('body', i, '{}'), 'Body', i);

	if (!endpoint || endpoint === NO_SERVER_INTERFACE) {
		throw new NodeOperationError(
			this.getNode(),
			'Choose an endpoint. If the list is empty, the Actor has no server interface.',
			{ itemIndex: i },
		);
	}

	let method: string;
	let path: string;
	if (endpoint === CUSTOM_ENDPOINT) {
		method = this.getNodeParameter('customMethod', i, 'GET') as string;
		path = this.getNodeParameter('customPath', i, '/') as string;
	} else {
		[method, path] = endpoint.split(' ');
	}
	if (!path.startsWith('/')) path = `/${path}`;

	// Fill OpenAPI path parameters like /items/{itemId} from the query JSON.
	path = path.replace(/\{([^}]+)\}/g, (match, name: string) => {
		if (!(name in query)) {
			throw new NodeOperationError(
				this.getNode(),
				`Missing value for path parameter "${name}". Add it to Query Parameters.`,
				{ itemIndex: i },
			);
		}
		const value = encodeURIComponent(String(query[name]));
		delete query[name];
		return value;
	});

	const { data: actor } = await apiRequest.call(this, {
		method: 'GET',
		uri: `/v2/acts/${actorId}`,
	});
	if (!actor?.actorStandby?.isEnabled || !actor.standbyUrl) {
		throw new NodeOperationError(
			this.getNode(),
			'This Actor has no server interface. Use the Input interface to start a run instead.',
			{ itemIndex: i },
		);
	}

	try {
		const response = await apiRequest.call(this, {
			method: method as any,
			uri: `${String(actor.standbyUrl).replace(/\/$/, '')}${path}`,
			qs: query,
			body: method === 'GET' ? undefined : body,
			timeout: timeoutSecs * 1000,
			returnFullResponse: true,
			// A Server Actor may charge per request, so a retry could charge twice.
			disableRetries: true,
		});

		const headers = (response?.headers ?? {}) as IDataObject;
		const contentType = (headers['content-type'] as string | undefined)?.split(';')[0];
		let responseBody = response?.body;
		if (typeof responseBody === 'string' && contentType === 'application/json') {
			try {
				responseBody = JSON.parse(responseBody);
			} catch {
				// keep the raw text
			}
		}

		return {
			json: {
				status: response?.statusCode ?? 200,
				contentType: contentType ?? null,
				body: responseBody ?? null,
			},
		};
	} catch (error) {
		const errorBody = error?.context?.data ?? error?.response?.body ?? error?.response?.data;
		const mapped = errorMessageFromBody(errorBody);
		if (mapped) {
			throw new NodeApiError(this.getNode(), { message: mapped.message } as any, {
				message: mapped.message,
				description: mapped.description,
				httpCode: error?.httpCode ? String(error.httpCode) : undefined,
				itemIndex: i,
			});
		}
		throw error instanceof NodeApiError
			? error
			: new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
	}
}
