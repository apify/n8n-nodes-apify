import { IExecuteFunctions, INodeExecutionData, NodeApiError } from 'n8n-workflow';
import { apiRequest } from '../../../resources/genericFunctions';

export async function getUserRunsList(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const offset = this.getNodeParameter('offset', i, 0) as number;
	const limit = this.getNodeParameter('limit', i, 50) as number;
	const desc = this.getNodeParameter('desc', i) as boolean;
	const status = this.getNodeParameter('status', i) as string;

	try {
		const runsList = await apiRequest.call(this, {
			method: 'GET',
			uri: '/v2/actor-runs',
			qs: { limit, offset, desc, status },
		});

		return { json: { runs: runsList.data?.items ?? [] } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
