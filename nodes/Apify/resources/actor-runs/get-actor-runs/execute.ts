import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { apiRequest } from '../../genericFunctions';

export async function getActorRuns(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData | INodeExecutionData[]> {
	const offset = this.getNodeParameter('offset', i, 0) as number;
	const limit = this.getNodeParameter('limit', i, 50) as number;
	const desc = this.getNodeParameter('desc', i) as boolean;
	const status = this.getNodeParameter('status', i) as string;

	const actorId = this.getNodeParameter('userActorId', i, undefined, {
		extractValue: true,
	}) as string;

	if (!actorId) {
		throw new NodeOperationError(this.getNode(), 'Actor ID is required');
	}

	try {
		const apiResult = await apiRequest.call(this, {
			method: 'GET',
			uri: `/v2/acts/${actorId}/runs`,
			qs: { limit, offset, desc, status },
		});

		return this.helpers.returnJsonArray(apiResult.data?.items ?? []);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
