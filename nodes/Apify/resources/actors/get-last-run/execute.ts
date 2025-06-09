import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { apiRequest } from '../../../resources/genericFunctions';

export async function getLastRun(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
	const actorId = this.getNodeParameter('actorId', i) as { value: string };

	if (!actorId) {
		throw new NodeOperationError(this, 'Actor ID is required');
	}

	try {
		const lastRun = await apiRequest.call(this, {
			method: 'GET',
			uri: `/v2/acts/${actorId.value}/runs/last`,
		});

		return { json: { ...lastRun } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
