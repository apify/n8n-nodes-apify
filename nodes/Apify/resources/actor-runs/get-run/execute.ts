import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { apiRequest } from '../../../resources/genericFunctions';

export async function getRun(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
	const runId = this.getNodeParameter('runId', i, undefined, {
		extractValue: true,
	}) as string;

	if (!runId) {
		throw new NodeOperationError(this, 'Run ID is required');
	}

	try {
		const run = await apiRequest.call(this, {
			method: 'GET',
			uri: `/v2/actor-runs/${runId}`,
		});

		if (!run) {
			throw new NodeApiError(this.getNode(), {
				message: `Run ${runId} not found`,
			});
		}

		if (run.error) {
			throw new NodeApiError(this.getNode(), {
				message: run.error.message,
				type: run.error.type,
			});
		}

		return { json: { ...run } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
