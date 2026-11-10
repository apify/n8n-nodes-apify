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
import { getServerActorOrigin, SERVER_ACTOR_MESSAGES as MESSAGES } from '../../serverActor';

interface ServerActorRequest {
	method: IHttpRequestMethods;
	path: string;
	query: IDataObject;
	body?: IDataObject | unknown[];
}

/** Reads the method, path and JSON query and body fields into one request. */
function getRequest(this: IExecuteFunctions, i: number): ServerActorRequest {
	// Upper-cased: an expression may give `post`.
	const method = (
		this.getNodeParameter('endpointMethod', i, 'GET') as string
	).toUpperCase() as IHttpRequestMethods;
	const path = (this.getNodeParameter('endpointPath', i, '/') as string).trim();
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
	// One leading slash: `//host/x` would read as a protocol-relative URL to some tools.
	return { method, path: `/${path.replace(/^\/+/, '')}`, query, body };
}

/**
 * Adds the query parameters after any query string already in the path. Arrays are repeated
 * (`?a=1&a=2`); objects are sent as JSON.
 */
function appendQuery(url: URL, query: IDataObject): void {
	const params = new URLSearchParams();
	const toText = (value: unknown) =>
		typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);
	for (const [name, value] of Object.entries(query)) {
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
	const request = getRequest.call(this, i);

	const origin = await getServerActorOrigin.call(this, actorId);
	if (!origin) {
		throw new NodeOperationError(this.getNode(), MESSAGES.noServerInterface, { itemIndex: i });
	}

	const url = new URL(`${origin}${request.path}`);
	appendQuery(url, request.query);
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
