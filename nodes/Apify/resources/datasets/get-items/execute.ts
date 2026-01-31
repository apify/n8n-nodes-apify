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
	const options = (this.getNodeParameter('options', i, {}) || {}) as {
		fields?: string;
		omit?: string;
	};

	if (!datasetId) {
		throw new NodeOperationError(this.getNode(), 'Dataset ID is required');
	}

	const qs: { offset: number; limit: number; fields?: string; omit?: string } = { offset, limit };

	if (options.fields) {
		qs.fields = options.fields;
	}

	if (options.omit) {
		qs.omit = options.omit;
	}

	try {
		const itemsArray = await apiRequest.call(this, {
			method: 'GET',
			uri: `/v2/datasets/${datasetId}/items`,
			qs,
		});

		return this.helpers.returnJsonArray(itemsArray);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
