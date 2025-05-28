import {
	NodeApiError,
	type IDataObject,
	type IExecuteFunctions,
	type IHookFunctions,
	type ILoadOptionsFunctions,
	type IHttpRequestOptions,
} from 'n8n-workflow';

import { APIFY_API_BASE_URL } from '../helpers/consts';

/**
 * Make an API request to Apify
 *
 */
export async function apiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	uri: string,
	requestOptions: Omit<IHttpRequestOptions, 'url'>,
): Promise<any> {
	const options: IHttpRequestOptions = {
		...requestOptions,
		url: `${APIFY_API_BASE_URL}${uri}`,
	};

	if (options.method === 'GET') {
		delete options.body;
	}

	try {
		const result = await this.helpers.httpRequestWithAuthentication.call(this, 'apifyApi', options);

		return result;
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
	uri: string,
	requestOptions: Omit<IHttpRequestOptions, 'url'>,
): Promise<any> {
	const returnData: IDataObject[] = [];
	// Ensure limit is set
	if (!requestOptions.qs) requestOptions.qs = {};
	requestOptions.qs.limit = requestOptions.qs.limit || 999;

	let responseData;

	do {
		responseData = await apiRequest.call(this, uri, requestOptions);

		returnData.push(responseData);
		// Optionally, update offset or pagination here if needed
		// For now, just break to avoid infinite loop
		break;
	} while ((requestOptions.qs?.limit ?? 0) <= (responseData?.length ?? 0));

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
