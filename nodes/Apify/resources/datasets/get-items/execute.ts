import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { apiRequest } from '../../../resources/genericFunctions';

export async function getItems(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const datasetId = this.getNodeParameter('datasetId', i) as string;
	const offset = this.getNodeParameter('offset', i, 0) as number;
	const limit = this.getNodeParameter('limit', i, 50) as number;

	if (!datasetId) {
		throw new NodeOperationError(this.getNode(), 'Dataset ID is required');
	}

	try {
		const itemsArray = await apiRequest.call(this, {
			method: 'GET',
			uri: `/v2/datasets/${datasetId}/items`,
			qs: { offset, limit },
		});

		return this.helpers.returnJsonArray(itemsArray);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
