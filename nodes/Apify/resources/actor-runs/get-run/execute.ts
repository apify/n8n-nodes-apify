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
		throw new NodeOperationError(this.getNode(), 'Run ID is required');
	}

	try {
		const apiResult = await apiRequest.call(this, {
			method: 'GET',
			uri: `/v2/actor-runs/${runId}`,
		});

		if (!apiResult) {
			throw new NodeApiError(this.getNode(), {
				message: `Run ${runId} not found`,
			});
		}

		if (apiResult.error) {
			throw new NodeApiError(this.getNode(), {
				message: apiResult.error.message,
				type: apiResult.error.type,
			});
		}

		return { json: { ...apiResult.data } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
