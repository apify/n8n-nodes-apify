import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { apiRequest } from '../../../resources/genericFunctions';

export async function getRun(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
	const runId = this.getNodeParameter('runId', i) as { value: string };

	if (!runId) {
		throw new NodeOperationError(this, 'Run ID is required');
	}

	try {
		const run = await apiRequest.call(this, {
			method: 'GET',
			uri: `/v2/actor-runs/${runId.value}`,
		});

		if (!run) {
			throw new NodeApiError(this.getNode(), {
				message: `Run ${runId.value} not found`,
			});
		}

		return { json: { ...run } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
