import {
	NodeApiError,
	NodeOperationError,
	type IDataObject,
	type IExecuteFunctions,
	type IHookFunctions,
	type ILoadOptionsFunctions,
	type IRequestOptions,
} from 'n8n-workflow';
import { createHash } from 'node:crypto';

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

		return await this.helpers.requestWithAuthentication.call(this, authenticationMethod, options);
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
	const hash = createHash('sha256');
	const sortedEventTypes = eventTypes.sort();
	hash.update(`${resource}:${actorOrTaskId}:${sortedEventTypes.join(',')}`);
	return hash.digest('hex');
}

export function compose(...fns: Function[]) {
	return (x: any) => fns.reduce((v, f) => f(v), x);
}
