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
	INodeExecutionData,
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

type IApiRequestOptions = Omit<IHttpRequestOptions, 'url'> & { uri?: string };

/**
 * Make an API request to Apify
 */
export async function apiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	requestOptions: IApiRequestOptions,
): Promise<any> {
	const { method, qs, uri, ...rest } = requestOptions;

	const query = qs || {};
	const endpoint = `https://api.apify.com${uri}`;

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

		return await retryWithExponentialBackoff(
			() => this.helpers.httpRequestWithAuthentication.call(this, authenticationMethod, options),
			// Only retry timeouts/network errors for idempotent GET requests. Retrying a
			// non-idempotent POST (e.g. starting an Actor run) could create duplicate runs.
			{ retryNetworkErrors: method === 'GET' },
		);
	} catch (error) {
		if (error instanceof NodeApiError) throw error;

		if (error.response && error.response.body) {
			throw new NodeApiError(this.getNode(), error, {
				message: error.response.body,
				description: error.message,
			});
		}

		throw new NodeApiError(this.getNode(), error);
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
			const shouldRetry =
				isStatusCodeRetryable(status) || (retryNetworkErrors && isNetworkError);
			if (shouldRetry) {
				//Generate a new sleep time based from interval * exponential^i function
				const sleepTimeSecs = interval * Math.pow(exponential, i);
				const sleepTimeMs = sleepTimeSecs * 1000;

				await sleep(sleepTimeMs);

				continue;
			}
			throw error;
		}
	}
	//In case all of the calls failed with no status or isStatusCodeRetryable, throw the last error
	throw lastError;
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
				// Propagade the error further
				throw error;
			}
		}
	}

	return [returnData];
}
