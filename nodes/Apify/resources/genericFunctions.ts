import {
	sleep,
	NodeApiError,
	NodeOperationError,
	type IDataObject,
	type IExecuteFunctions,
	type IHookFunctions,
	type ILoadOptionsFunctions,
	type IRequestOptions,
} from 'n8n-workflow';
import {
	DEFAULT_EXP_BACKOFF_EXPONENTIAL,
	DEFAULT_EXP_BACKOFF_INTERVAL,
	DEFAULT_EXP_BACKOFF_RETRIES,
} from '../helpers/consts';

type IApiRequestOptions = IRequestOptions & { uri?: string };

/**
 * Make an API request to Apify
 *
 */
export async function apiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	requestOptions: IApiRequestOptions,
): Promise<any> {
	const { method, qs, uri, ...rest } = requestOptions;

	const query = qs || {};
	const endpoint = `https://api.apify.com${uri}`;

	const options: IRequestOptions = {
		json: true,
		...rest,
		method,
		qs: query,
		url: endpoint,
		headers: {
			'x-apify-integration-platform': 'n8n',
		},
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

		return await retryWithExponentialBackoff(() =>
			this.helpers.requestWithAuthentication.call(this, authenticationMethod, options),
		);
	} catch (error) {
		/**
		 * using `error instanceof NodeApiError` results in `false`
		 * because it's thrown by a different instance of n8n-workflow
		 */
		if (error.constructor?.name === 'NodeApiError') {
			throw error;
		}

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

/**
 * Wraps a function with exponential backoff.
 * If request fails with http code 500+ or doesn't return
 * a code at all it is retried in 1s,2s,4s,.. up to maxRetries
 * @param fn
 * @param interval
 * @param exponential
 * @param maxRetries
 * @returns
 */
export async function retryWithExponentialBackoff(
	fn: () => Promise<any>,
	interval: number = DEFAULT_EXP_BACKOFF_INTERVAL,
	exponential: number = DEFAULT_EXP_BACKOFF_EXPONENTIAL,
	maxRetries: number = DEFAULT_EXP_BACKOFF_RETRIES,
): Promise<any> {
	let lastError;
	for (let i = 0; i < maxRetries; i++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;
			const status = Number(error?.httpCode);
			if (isStatusCodeRetryable(status)) {
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
	while (true) {
		try {
			const pollResult = await apiRequest.call(this, {
				method: 'GET',
				uri: `/v2/actor-runs/${runId}`,
			});
			const status = pollResult?.data?.status;
			lastRunData = pollResult?.data;
			if (['SUCCEEDED', 'FAILED', 'TIMED-OUT', 'ABORTED'].includes(status)) {
				break;
			}
		} catch (err) {
			throw new NodeApiError(this.getNode(), {
				message: `Error polling run status: ${err}`,
			});
		}
		await sleep(1000); // 1 second polling interval
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
