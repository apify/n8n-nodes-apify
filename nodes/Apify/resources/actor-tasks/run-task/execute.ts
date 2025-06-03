import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { getAuthedApifyClient } from '../../../helpers/apify-client';

export async function runTask(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
	const taskId = this.getNodeParameter('taskId', i) as { value: string };
	const input = this.getNodeParameter('input', i, {}) as object;

	if (!taskId) {
		throw new NodeOperationError(this, 'Task ID is required');
	}

	const client = await getAuthedApifyClient.call(this);

	try {
		const run = await client.task(taskId.value).call(input as any);

		if (!run) {
			throw new NodeApiError(this.getNode(), {
				message: `Task run for ${taskId.value} not found`,
			});
		}

		return { json: { ...run } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
