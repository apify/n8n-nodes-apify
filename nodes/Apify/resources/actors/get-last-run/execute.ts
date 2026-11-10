import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { apiRequest, toNodeApiError } from '../../../resources/genericFunctions';

export async function getLastRun(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
	const actorId = this.getNodeParameter('userActorId', i) as { value: string };
	const status = this.getNodeParameter('status', i) as string;

	if (!actorId) {
		throw new NodeOperationError(this.getNode(), 'Actor ID is required');
	}

	try {
		const apiResult = await apiRequest.call(this, {
			method: 'GET',
			uri: `/v2/acts/${actorId.value}/runs/last`,
			qs: { status },
		});

		return { json: { ...apiResult.data } };
	} catch (error) {
		throw toNodeApiError(this.getNode(), error);
	}
}
