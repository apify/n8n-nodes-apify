import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { getAuthedApifyClient } from '../../../helpers/apify-client';

export async function runTask(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
	const actorTaskId = this.getNodeParameter('actorTaskId', i) as { value: string };
	const input = this.getNodeParameter('input', i, {}) as object;

	if (!actorTaskId) {
		throw new NodeOperationError(this, 'Task ID is required');
	}

	const client = await getAuthedApifyClient.call(this);

	try {
		const run = await client.task(actorTaskId.value).call(input as any);

		if (!run) {
			throw new NodeApiError(this.getNode(), {
				message: `Task run for ${actorTaskId.value} not found`,
			});
		}

		return { json: { ...run } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
