import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { getAuthedApifyClient } from '../../../helpers/apify-client';

export async function getItems(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
	const datasetId = this.getNodeParameter('datasetId', i) as string;
	const offset = this.getNodeParameter('offset', i, 0) as number;
	const limit = this.getNodeParameter('limit', i, 50) as number;

	if (!datasetId) {
		throw new NodeOperationError(this, 'Dataset ID is required');
	}

	const client = await getAuthedApifyClient.call(this);

	try {
		const { items } = await client.dataset(datasetId).listItems({
			offset: offset === null ? undefined : offset,
			limit: limit === null ? undefined : limit,
		});

		return { json: { items } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
