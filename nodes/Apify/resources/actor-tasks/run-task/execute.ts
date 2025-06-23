import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { apiRequest } from '../../../resources/genericFunctions';

export async function runTask(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
	const actorTaskId = this.getNodeParameter('actorTaskId', i, undefined, {
		extractValue: true,
	}) as string;
	const input = this.getNodeParameter('input', i, {}) as object;
	const waitForFinish = this.getNodeParameter('waitForFinish', i, null) as number | null;
	const timeout = this.getNodeParameter('timeout', i, null) as number | null;
	const memory = this.getNodeParameter('memory', i, null) as number | null;
	const build = this.getNodeParameter('build', i, '') as string;

	if (!actorTaskId) {
		throw new NodeOperationError(this, 'Task ID is required');
	}

	const qs: Record<string, any> = {};
	if (waitForFinish != null) qs.waitForFinish = waitForFinish;
	if (timeout != null) qs.timeout = timeout;
	if (memory != null) qs.memory = memory;
	if (build) qs.build = build;

	try {
		const run = await apiRequest.call(this, {
			method: 'POST',
			uri: `/v2/actor-tasks/${actorTaskId}/runs`,
			body: input,
			qs,
		});

		if (!run) {
			throw new NodeApiError(this.getNode(), {
				message: `Task run for ${actorTaskId} not found`,
			});
		}

		return { json: { ...run } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
