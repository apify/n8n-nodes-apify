/* eslint-disable */
import {
	sleep,
	NodeApiError,
	NodeOperationError,
	type IDataObject,
	type IExecuteFunctions,
	type IHookFunctions,
	type ILoadOptionsFunctions,
	IHttpRequestOptions,
	type INode,
	INodeExecutionData,
	type FieldType,
	type ResourceMapperField,
} from 'n8n-workflow';
import {
	DEFAULT_EXP_BACKOFF_EXPONENTIAL,
	DEFAULT_EXP_BACKOFF_INTERVAL,
	DEFAULT_EXP_BACKOFF_RETRIES,
	DEFAULT_REQUEST_TIMEOUT_MS,
	TERMINAL_RUN_STATUSES,
	WAIT_FOR_FINISH_BUFFER_MS,
	WAIT_FOR_FINISH_MAX_DURATION_MS,
	WAIT_FOR_FINISH_POLL_INTERVAL,
} from '../helpers/consts';

type IApiRequestOptions = Omit<IHttpRequestOptions, 'url'> & {
	uri?: string;
	/** Send the request once: no retries at all, e.g. for Server Actor requests that may be charged. */
	disableRetries?: boolean;
};

/** Escape a string for interpolation into HTML markup. */
export function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

/** Returns the value only if it is an absolute http(s) URL, otherwise `undefined`. */
function toSafeHttpUrl(value: unknown): string | undefined {
	if (typeof value !== 'string' || !value) return undefined;
	try {
		const parsed = new URL(value);
		if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return undefined;
		return parsed.toString();
	} catch {
		return undefined;
	}
}

/**
 * Whether `error` is a NodeApiError, including one from n8n's own copy of n8n-workflow, for
 * which `instanceof` fails when another copy is installed next to this node.
 */
function isNodeApiError(error: unknown): boolean {
	return (
		error instanceof NodeApiError ||
		(error instanceof Error && error.constructor?.name === 'NodeApiError')
	);
}

/**
 * Wrap `error` in a NodeApiError unless it already is one. NodeApiError's own pass-through uses
 * `instanceof`, so it would re-wrap one from n8n's copy and lose its message and `context`.
 */
export function toNodeApiError(node: INode, error: any): Error {
	return isNodeApiError(error) ? error : new NodeApiError(node, error);
}

/**
 * Make an API request to Apify
 */
export async function apiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	requestOptions: IApiRequestOptions,
): Promise<any> {
	const { method, qs, uri, disableRetries, ...rest } = requestOptions;

	const query = qs || {};
	// An absolute URL (e.g. an Actor's standby endpoint) is used as-is, otherwise
	// the path is resolved against the Apify API base URL.
	const endpoint = uri?.startsWith('http') ? uri : `https://api.apify.com${uri}`;

	const headers: Record<string, string> = {
		'x-apify-integration-platform': 'n8n',
	};

	if (isUsedAsAiTool(this.getNode().type)) {
		headers['x-apify-integration-ai-tool'] = 'true';
	}

	const options: IHttpRequestOptions = {
		json: true,
		// Can be overridden per request via `requestOptions.timeout`.
		timeout: DEFAULT_REQUEST_TIMEOUT_MS,
		...rest,
		method,
		qs: query,
		url: endpoint,
		headers,
	};

	if (method === 'GET') {
		delete options.body;
	}

	try {
		const authenticationMethod = this.getNodeParameter('authentication', 0) as string;
		try {
			await this.getCredentials(authenticationMethod);
		} catch {
			throw new NodeOperationError(
				this.getNode(),
				`No valid credentials found for ${authenticationMethod}. Please configure them first.`,
			);
		}

		const send = () =>
			this.helpers.httpRequestWithAuthentication.call(this, authenticationMethod, options);
		if (disableRetries) return await send();

		return await retryWithExponentialBackoff.call(
			this,
			send,
			// Only retry timeouts/network errors for idempotent GET requests. Retrying a
			// non-idempotent POST (e.g. starting an Actor run) could create duplicate runs.
			{ retryNetworkErrors: method === 'GET' },
		);
	} catch (error) {
		// Give the full-permission-approval error an actionable message + link instead of the
		// generic 403. n8n keeps the response body on `error.context.data`.
		const apifyError = error?.context?.data?.error;
		if (apifyError?.type === 'full-permission-actor-not-approved') {
			const rawApprovalUrl =
				typeof apifyError.data?.approvalUrl === 'string' ? apifyError.data.approvalUrl : '';
			// Untrusted response data - validate before it goes anywhere near an `href`.
			const approvalUrl = toSafeHttpUrl(rawApprovalUrl);
			// Mutate and re-throw the same error object so the host keeps our message.
			// The API appends the URL to its own message, so strip it and the dangling ":".
			const reason = (
				apifyError.message || 'This Actor requires permission approval before it can run.'
			)
				.replace(rawApprovalUrl, '')
				.replace(/[\s:]+$/, '')
				.trim();
			const cta = "Approve this Actor's permissions, then run it again";

			// The URL only ever goes in `description`: n8n replaces any `message` containing an
			// error code, and `approvePermissions` contains `EPERM`. As an AI tool n8n appends
			// `description` to `message`, so it must be plain text there; the UI renders it as
			// HTML, so a clickable link needs an `<a>` tag.
			if (!approvalUrl) {
				error.message = reason;
				error.description = undefined;
			} else if (isUsedAsAiTool(this.getNode().type)) {
				error.message = `${reason}. ${cta}.`;
				error.description = approvalUrl;
			} else {
				const url = escapeHtml(approvalUrl);
				error.message = `${reason}. See the approval link in the node output.`;
				error.description = `${cta}: <a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
			}
			if (Array.isArray(error.messages)) error.messages = [error.message];
			throw toNodeApiError(this.getNode(), error);
		}

		if (!isNodeApiError(error) && error.response && error.response.body) {
			throw new NodeApiError(this.getNode(), error, {
				message: error.response.body,
				description: error.message,
			});
		}

		throw toNodeApiError(this.getNode(), error);
	}
}

/**
 * Validate that a value is a full http(s) URL with a proper domain name,
 * throwing a NodeOperationError with an actionable message otherwise.
 */
export function validateUrl(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	url: string,
	itemIndex: number,
): void {
	const isValidHostname = (hostname: string): boolean =>
		/^(?=.{1,253}$)((?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}$/.test(hostname);
	try {
		const parsedUrl = new URL(url);
		if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
			throw new Error('Unsupported protocol');
		}
		if (!isValidHostname(parsedUrl.hostname)) {
			throw new Error('Invalid hostname');
		}
	} catch {
		throw new NodeOperationError(
			this.getNode(),
			`Invalid URL: "${url}". Provide a full, valid URL including a domain name, e.g. https://example.com.`,
			{ itemIndex },
		);
	}
}

/**
 * Checks if the given status code is retryable
 * Status codes 429 (rate limit) and 500+ are retried,
 * Other status codes 300-499 (except 429) are not retried,
 * because the error is probably caused by invalid URL (redirect 3xx) or invalid user input (4xx).
 */
function isStatusCodeRetryable(statusCode: number) {
	if (Number.isNaN(statusCode)) return false;

	const RATE_LIMIT_EXCEEDED_STATUS_CODE = 429;
	const isRateLimitError = statusCode === RATE_LIMIT_EXCEEDED_STATUS_CODE;
	const isInternalError = statusCode >= 500;
	return isRateLimitError || isInternalError;
}

interface RetryOptions {
	interval?: number;
	exponential?: number;
	maxRetries?: number;
	// Whether to retry network errors that carry no HTTP status code (e.g. socket timeouts).
	retryNetworkErrors?: boolean;
}

/**
 * Wraps a function with exponential backoff.
 * Retries on HTTP 429 / 500+ (in 1s,2s,4s,.. up to maxRetries). When `retryNetworkErrors`
 * is set, errors without an HTTP status code (e.g. socket timeouts) are retried too.
 */
export async function retryWithExponentialBackoff(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	fn: () => Promise<any>,
	options: RetryOptions = {},
): Promise<any> {
	const {
		interval = DEFAULT_EXP_BACKOFF_INTERVAL,
		exponential = DEFAULT_EXP_BACKOFF_EXPONENTIAL,
		maxRetries = DEFAULT_EXP_BACKOFF_RETRIES,
		retryNetworkErrors = false,
	} = options;

	let lastError;
	for (let i = 0; i < maxRetries; i++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;
			const status = Number(error?.httpCode);
			// A missing/non-numeric status code usually means a network-level error
			// (timeout, connection reset, DNS) rather than an HTTP response.
			const isNetworkError = Number.isNaN(status);
			const shouldRetry = isStatusCodeRetryable(status) || (retryNetworkErrors && isNetworkError);
			if (shouldRetry) {
				//Generate a new sleep time based from interval * exponential^i function
				const sleepTimeSecs = interval * Math.pow(exponential, i);
				const sleepTimeMs = sleepTimeSecs * 1000;

				await sleep(sleepTimeMs);

				continue;
			}
			throw toNodeApiError(this.getNode(), error);
		}
	}
	//In case all of the calls failed with no status or isStatusCodeRetryable, throw the last error
	throw toNodeApiError(this.getNode(), lastError);
}

export async function apiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	requestOptions: IApiRequestOptions,
): Promise<any> {
	const returnData: IDataObject[] = [];
	if (!requestOptions.qs) requestOptions.qs = {};
	requestOptions.qs.limit = requestOptions.qs.limit || 999;

	let responseData;

	do {
		responseData = await apiRequest.call(this, requestOptions);
		returnData.push(responseData);
	} while (requestOptions.qs.limit <= responseData.length);

	const combinedData = {
		data: {
			total: 0,
			count: 0,
			offset: 0,
			limit: 0,
			desc: false,
			items: [] as IDataObject[],
		},
	};

	for (const result of returnData) {
		combinedData.data.total += typeof result.total === 'number' ? result.total : 0;
		combinedData.data.count += typeof result.count === 'number' ? result.count : 0;
		combinedData.data.offset += typeof result.offset === 'number' ? result.offset : 0;
		combinedData.data.limit += typeof result.limit === 'number' ? result.limit : 0;

		if (
			result.data &&
			typeof result.data === 'object' &&
			'items' in result.data &&
			Array.isArray((result.data as IDataObject).items)
		) {
			combinedData.data.items = [
				...combinedData.data.items,
				...(result.data.items as IDataObject[]),
			];
		}
	}

	return combinedData;
}

export async function pollRunStatus(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	runId: string,
): Promise<any> {
	let lastRunData: any;
	const startedAt = Date.now();
	// The max timeout is based on run timeout or maximum, in case there is no timeout.
	let maxDurationMs = WAIT_FOR_FINISH_MAX_DURATION_MS;
	let timeoutChecked = false;
	while (true) {
		try {
			const pollResult = await apiRequest.call(this, {
				method: 'GET',
				uri: `/v2/actor-runs/${runId}`,
			});
			const status = pollResult?.data?.status;
			lastRunData = pollResult?.data;
			if (TERMINAL_RUN_STATUSES.includes(status)) {
				break;
			}
			if (!timeoutChecked) {
				const timeoutSecs = Number(lastRunData?.options?.timeoutSecs);
				if (Number.isFinite(timeoutSecs) && timeoutSecs > 0) {
					maxDurationMs = timeoutSecs * 1000 + WAIT_FOR_FINISH_BUFFER_MS;
				}
				timeoutChecked = true;
			}
		} catch (err) {
			throw new NodeApiError(this.getNode(), {
				message: `Error polling run status: ${err}`,
			});
		}
		const elapsedMs = Date.now() - startedAt;
		if (elapsedMs > maxDurationMs) {
			throw new NodeApiError(this.getNode(), {
				message: `Timed out after ${Math.round(elapsedMs / 1000)}s waiting for run ${runId} to finish. Last known status: ${lastRunData?.status ?? 'unknown'}.`,
			});
		}
		await sleep(WAIT_FOR_FINISH_POLL_INTERVAL);
	}
	return lastRunData;
}

export function getActorOrTaskId(this: IHookFunctions): string {
	const resource = this.getNodeParameter('resource', '') as string;
	const actorId = this.getNodeParameter('actorId', '') as { value: string };
	const actorTaskId = this.getNodeParameter('actorTaskId', '') as { value: string };

	if (resource === 'task') {
		return actorTaskId.value;
	}

	return actorId.value;
}

export function getCondition(this: IHookFunctions, resource: string, id: string): object {
	return resource === 'actor' ? { actorId: id } : { actorTaskId: id };
}

export function normalizeEventTypes(selected: string[]): string[] {
	if (selected.includes('any')) {
		return ['ACTOR.RUN.SUCCEEDED', 'ACTOR.RUN.FAILED', 'ACTOR.RUN.TIMED_OUT', 'ACTOR.RUN.ABORTED'];
	}
	return selected;
}

export function generateIdempotencyKey(
	resource: string,
	actorOrTaskId: string,
	eventTypes: string[],
): string {
	const sortedEventTypes = [...eventTypes].sort();
	const raw = `${resource}:${actorOrTaskId}:${sortedEventTypes.join(',')}`;
	return Buffer.from(raw).toString('base64');
}

export function compose(...fns: Function[]) {
	return (x: any) => fns.reduce((v, f) => f(v), x);
}

export function customBodyParser(input: string | object) {
	if (!input) {
		return {};
	}

	if (typeof input === 'string') {
		return input ? JSON.parse(input) : {};
	} else {
		// When an AI Agent Tool calls the node
		// It sometimes sends an object instead of a string
		return input;
	}
}

export function isUsedAsAiTool(nodeType: string): boolean {
	const parts = nodeType.split('.');
	return parts[parts.length - 1] === 'apifyTool';
}

/**
 * Text for an error description. The editor renders descriptions as HTML, so untrusted text is
 * escaped there; as an AI tool, n8n passes the description on as plain text.
 */
export function toDescriptionText(node: INode, text: string): string {
	return isUsedAsAiTool(node.type) ? text : escapeHtml(text);
}

/** Whether a request failed because it timed out, on the error n8n throws or on its cause. */
export function isTimeoutError(error: unknown): boolean {
	const candidates = [error, (error as { cause?: unknown })?.cause];
	return candidates.some((candidate) => {
		const code = (candidate as { code?: unknown })?.code;
		return code === 'ECONNABORTED' || code === 'ETIMEDOUT' || code === 'ESOCKETTIMEDOUT';
	});
}

/**
 * Reads a JSON node parameter that must be an object (or, with `allowArray`, an array). Empty
 * text means `{}`; an object is taken as is, since AI Agent tool calls sometimes send one.
 */
export function parseJsonParameter(
	this: IExecuteFunctions,
	raw: unknown,
	label: string,
	itemIndex: number,
	{ allowArray = false } = {},
): IDataObject | unknown[] {
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
	if (isPlainObject) return value as IDataObject;
	if (allowArray && Array.isArray(value)) return value;
	throw new NodeOperationError(
		this.getNode(),
		`${label} must be a JSON ${allowArray ? 'object or array' : 'object'}`,
		{ itemIndex },
	);
}

/**
 * A JSON Schema property's resource mapper type: `options` for an `enum` (labelled by
 * `enumTitles` where given; values that aren't strings, numbers or booleans are dropped, keeping
 * titles paired with their values), else the type matching its `type`.
 */
export function getFieldTypeAndOptions(
	schema: { type?: unknown; enum?: unknown; enumTitles?: unknown } = {},
): Pick<ResourceMapperField, 'type' | 'options'> {
	const titles: unknown[] = Array.isArray(schema.enumTitles) ? schema.enumTitles : [];
	const options = (Array.isArray(schema.enum) ? schema.enum : [])
		.map((value: unknown, index) => ({ value, title: titles[index] }))
		.filter(
			(entry): entry is { value: string | number | boolean; title: unknown } =>
				typeof entry.value === 'string' ||
				typeof entry.value === 'number' ||
				typeof entry.value === 'boolean',
		)
		.map(({ value, title }) => ({
			name: typeof title === 'string' ? title : String(value),
			value,
		}));
	return options.length > 0 ? { type: 'options', options } : { type: getFieldType(schema.type) };
}

function getFieldType(type: unknown): FieldType {
	switch (type) {
		case 'boolean':
			return 'boolean';
		case 'integer':
		case 'number':
			return 'number';
		case 'array':
			return 'array';
		case 'object':
			return 'object';
		default:
			return 'string';
	}
}

/** A schema value as a field's `defaultValue`; object and array fields are edited as JSON text. */
export function toFieldDefaultValue(value: unknown): ResourceMapperField['defaultValue'] {
	if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
		return value;
	}
	if (value !== null && typeof value === 'object') return JSON.stringify(value, null, 2);
	return undefined;
}

/**
 * A resource mapper's values for item `i`, without unset (`null`) fields so the API's own
 * defaults apply. Reading `.value` makes n8n validate the fields and parse the JSON of object
 * and array fields.
 */
export function getResourceMapperValues(
	this: IExecuteFunctions,
	parameterName: string,
	i: number,
): IDataObject {
	const values = this.getNodeParameter(`${parameterName}.value`, i, {}) as IDataObject | null;
	return Object.fromEntries(
		Object.entries(values ?? {}).filter(([, value]) => value !== null && value !== undefined),
	);
}

/** An error's message, plus the API's own reason that NodeApiError keeps in `description`. */
export function getErrorReason(error: unknown): string {
	if (!(error instanceof Error)) return String(error);
	const rawDescription = (error as { description?: unknown }).description;
	// Drop link tags meant for the error view; a notice escapes them and would show raw tags.
	const description =
		typeof rawDescription === 'string' ? rawDescription.replace(/<\/?a\b[^>]*>/g, '') : undefined;
	return description && description !== error.message
		? `${error.message} (${description})`
		: error.message;
}

const TEXT_CONTENT_TYPES =
	/^(text\/|application\/(.+\+)?(json|xml|javascript|ecmascript|x-ndjson|ndjson|x-www-form-urlencoded|yaml|x-yaml|graphql|csv)$)/;

function decodeUtf8(buffer: Buffer): string | undefined {
	try {
		return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
	} catch {
		return undefined;
	}
}

/**
 * Decodes a raw response body read with `encoding: 'arraybuffer'`: JSON is parsed, other text
 * stays a string, and binary data returns `{ binary: true }`. A body without a content type
 * counts as text if it is valid UTF-8. `contentType` is the lowercased type without parameters.
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
	if (!contentType || /^application\/(.+\+)?json$/.test(contentType)) {
		try {
			return { body: JSON.parse(text) };
		} catch {
			return { body: text };
		}
	}
	return { body: text };
}

function nonEmptyString(value: unknown): string | undefined {
	return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

/**
 * Finds an error message in a response body: Apify's `{ error: { type, message } }`, a flat
 * `{ error, code }` (e.g. Web Fetch), `{ message }`, `{ detail }`, `{ title }`, or plain text.
 */
export function getErrorFromBody(body: unknown): { message?: string; type?: string } {
	if (typeof body === 'string') return { message: nonEmptyString(body)?.slice(0, 1000) };
	if (!body || typeof body !== 'object' || Array.isArray(body)) return {};
	const data = body as IDataObject;
	const nested = data.error && typeof data.error === 'object' ? (data.error as IDataObject) : {};
	return {
		message:
			nonEmptyString(nested.message) ??
			nonEmptyString(data.error) ??
			nonEmptyString(data.message) ??
			nonEmptyString(data.detail) ??
			nonEmptyString(data.title),
		type: nonEmptyString(nested.type) ?? nonEmptyString(data.code) ?? nonEmptyString(data.type),
	};
}

export async function executeAndLinkItems<T extends INodeExecutionData | INodeExecutionData[]>(
	this: IExecuteFunctions,
	executeFn: (this: IExecuteFunctions, itemIndex: number) => Promise<T>,
): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const addPairedItem = (item: INodeExecutionData) => ({
				...item,
				pairedItem: { item: i },
			});

			const result = await executeFn.call(this, i);

			if (Array.isArray(result)) {
				returnData.push(...result.map(addPairedItem));
			} else {
				returnData.push(addPairedItem(result));
			}
		} catch (error) {
			// Don't throw error just log it
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message || 'Unexpected error occured' },
					pairedItem: { item: i },
				});
			} else {
				// Propagate the error further
				throw toNodeApiError(this.getNode(), error);
			}
		}
	}

	return [returnData];
}
