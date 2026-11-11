import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IN8nHttpFullResponse,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { SERVER_ACTOR_REQUEST_TIMEOUT_MS } from '../../../helpers/consts';
import {
	apiRequest,
	decodeResponseBody,
	getErrorFromBody,
	isTimeoutError,
	parseJsonParameter,
	toDescriptionText,
	toNodeApiError,
} from '../../genericFunctions';
import {
	CUSTOM_ENDPOINT,
	getServerActorOpenApi,
	getServerActorOrigin,
	MCP_ONLY,
	NO_ACTOR_SELECTED,
	NO_SERVER_INTERFACE,
	SERVER_ACTOR_MESSAGES as MESSAGES,
} from '../../serverActor';
import {
	getEndpointOperation,
	getNonExplodedQueryParams,
	parseEndpointValue,
} from '../../serverActorOpenApi';

interface ServerActorRequest {
	method: IHttpRequestMethods;
	path: string;
	query: IDataObject;
	body?: IDataObject | unknown[];
}

function readJsonFields(this: IExecuteFunctions, i: number, method: string) {
	const query = parseJsonParameter.call(
		this,
		this.getNodeParameter('endpointQuery', i, '{}'),
		'Query Parameters',
		i,
	) as IDataObject;
	const body =
		method === 'GET'
			? undefined
			: parseJsonParameter.call(this, this.getNodeParameter('endpointBody', i, '{}'), 'Body', i, {
					allowArray: true,
				});
	return { query, body };
}

/** Reads the endpoint (or Custom Path's method and path) and the JSON fields into one request. */
function getRequest(this: IExecuteFunctions, i: number, endpointValue: string): ServerActorRequest {
	if (endpointValue === CUSTOM_ENDPOINT) {
		// Upper-cased: an expression may give `post`.
		const method = (
			this.getNodeParameter('endpointMethod', i, 'GET') as string
		).toUpperCase() as IHttpRequestMethods;
		const path = (this.getNodeParameter('endpointPath', i, '/') as string).trim();
		// One leading slash: `//host/x` would read as a protocol-relative URL to some tools.
		return {
			method,
			path: `/${path.replace(/^\/+/, '')}`,
			...readJsonFields.call(this, i, method),
		};
	}

	const endpoint = parseEndpointValue(endpointValue);
	if (!endpoint) {
		throw new NodeOperationError(
			this.getNode(),
			`Unknown endpoint "${endpointValue}". Use the form "POST /path" or choose Custom Path.`,
			{ itemIndex: i },
		);
	}
	const method = endpoint.method as IHttpRequestMethods;
	const { query, body } = readJsonFields.call(this, i, method);

	// Fill path parameters such as /items/{itemId} from Query Parameters.
	const path = endpoint.path.replace(/\{([^}]+)\}/g, (_, name: string) => {
		const value = query[name];
		if (value === undefined || value === null || value === '') {
			throw new NodeOperationError(
				this.getNode(),
				`Missing value for path parameter "${name}". Add it to Query Parameters.`,
				{ itemIndex: i },
			);
		}
		delete query[name];
		return encodeURIComponent(String(value));
	});
	return { method, path, query, body };
}

/**
 * Adds the query parameters after any query string already in the path. Arrays are repeated
 * (`?a=1&a=2`), or comma-separated for the names in `commaSeparated` (OpenAPI `explode: false`);
 * objects are sent as JSON.
 */
function appendQuery(url: URL, query: IDataObject, commaSeparated = new Set<string>()): void {
	const params = new URLSearchParams();
	const toText = (value: unknown) =>
		typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);
	for (const [name, value] of Object.entries(query)) {
		if (Array.isArray(value) && commaSeparated.has(name)) {
			params.append(name, value.map(toText).join(','));
			continue;
		}
		for (const item of Array.isArray(value) ? value : [value]) params.append(name, toText(item));
	}
	const added = params.toString();
	if (added) url.search = url.search ? `${url.search}&${added}` : added;
}

/** The error for a 4xx or 5xx answer, with the Actor's own message and type when it sent them. */
function toActorError(
	this: IExecuteFunctions,
	status: number,
	body: unknown,
	i: number,
): NodeApiError {
	const { message, type } = getErrorFromBody(body);
	// Apify's own 504 after 300 s without an answer, or an Actor's gateway timeout.
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
	const error = new NodeApiError(
		this.getNode(),
		{ message: errorMessage, httpCode: String(status) },
		{
			message: errorMessage,
			// `type` and `message` come from the Actor's response.
			description: toDescriptionText(this.getNode(), description),
			httpCode: String(status),
			itemIndex: i,
		},
	);
	// n8n swaps a message containing a Node error code (e.g. ETIMEDOUT) for its own wording,
	// which can suggest Retry On Fail.
	error.message = errorMessage;
	return error;
}

/** Sends one request to the Actor's server and returns `{ status, contentType, body }`. */
export async function sendServerActorRequest(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const actorId = this.getNodeParameter('actorId', i, undefined, { extractValue: true }) as string;
	const endpointValue = (this.getNodeParameter('endpoint', i, '') as string) || '';

	const placeholderMessage = new Map([
		['', MESSAGES.noEndpoint],
		[NO_ACTOR_SELECTED, MESSAGES.noEndpoint],
		[NO_SERVER_INTERFACE, MESSAGES.noServerInterface],
		[MCP_ONLY, MESSAGES.mcpOnly],
	]).get(endpointValue);
	if (placeholderMessage) {
		throw new NodeOperationError(this.getNode(), placeholderMessage, { itemIndex: i });
	}

	const request = getRequest.call(this, i, endpointValue);

	const origin = await getServerActorOrigin.call(this, actorId);
	if (!origin) {
		throw new NodeOperationError(this.getNode(), MESSAGES.noServerInterface, { itemIndex: i });
	}

	// A documented endpoint must still be in the Actor's OpenAPI: after the Actor is changed, a
	// saved endpoint of the previous Actor would otherwise go to the new one, and may be charged.
	let commaSeparated: Set<string> | undefined;
	const endpoint =
		endpointValue === CUSTOM_ENDPOINT ? undefined : parseEndpointValue(endpointValue);
	if (endpoint) {
		const document = await getServerActorOpenApi.call(this, actorId);
		const operation = getEndpointOperation(document, endpoint.method, endpoint.path);
		if (!operation) {
			throw new NodeOperationError(
				this.getNode(),
				`The endpoint "${endpointValue}" isn't in this Actor's OpenAPI definition. Choose the endpoint again, or use Custom Path.`,
				{ itemIndex: i },
			);
		}
		commaSeparated = getNonExplodedQueryParams(operation.parameters);
	}

	const url = new URL(`${origin}${request.path}`);
	appendQuery(url, request.query, commaSeparated);
	// A path like `//other.host` must not move the request (and the token) to another host.
	if (url.origin !== origin) {
		throw new NodeOperationError(this.getNode(), `Invalid path "${request.path}"`, {
			itemIndex: i,
		});
	}

	let response: IN8nHttpFullResponse;
	try {
		response = await apiRequest.call(this, {
			method: request.method,
			uri: url.toString(),
			body: request.body as IDataObject | undefined,
			json: false,
			encoding: 'arraybuffer',
			returnFullResponse: true,
			// Read the Actor's own error responses instead of n8n's generic ones.
			ignoreHttpStatusErrors: true,
			// Above Apify's 300 s, so its 504 arrives before n8n gives up.
			timeout: SERVER_ACTOR_REQUEST_TIMEOUT_MS,
			// The request may be charged, so never send it twice.
			disableRetries: true,
			// n8n re-sends the token to wherever a redirect points, even another host.
			disableFollowRedirect: true,
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
		// apiRequest already throws a NodeApiError; keep it (and its context) as it is.
		throw toNodeApiError(this.getNode(), error);
	}

	const status = response.statusCode;
	const contentType = String(response.headers['content-type'] ?? '')
		.split(';')[0]
		.trim()
		.toLowerCase();
	const decoded = decodeResponseBody(response.body, contentType);

	if (status >= 400) {
		throw toActorError.call(this, status, 'body' in decoded ? decoded.body : undefined, i);
	}
	if ('binary' in decoded) {
		throw new NodeOperationError(this.getNode(), MESSAGES.binary, {
			description: toDescriptionText(this.getNode(), `Content type: ${contentType || 'unknown'}`),
			itemIndex: i,
		});
	}

	return {
		json: { status, contentType: contentType || null, body: decoded.body as IDataObject },
	};
}
