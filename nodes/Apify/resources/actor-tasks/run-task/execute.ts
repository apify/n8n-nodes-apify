import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { apiRequest, customBodyParser, pollRunStatus } from '../../../resources/genericFunctions';

export async function runTask(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
	const actorTaskId = this.getNodeParameter('actorTaskId', i, undefined, {
		extractValue: true,
	}) as string;
	const rawStringifiedInput = this.getNodeParameter('customBody', i, '{}') as string | object;
	const waitForFinish = this.getNodeParameter('waitForFinish', i) as boolean;
	const timeout = this.getNodeParameter('timeout', i, null) as number | null;
	const memory = this.getNodeParameter('memory', i, null) as number | null;
	const build = this.getNodeParameter('build', i, '') as string;

	let input: any;
	try {
		input = customBodyParser(rawStringifiedInput);
	} catch {
		throw new NodeOperationError(
			this.getNode(),
			`Could not parse custom body: ${rawStringifiedInput}`,
		);
	}

	if (!actorTaskId) {
		throw new NodeOperationError(this.getNode(), 'Task ID is required');
	}

	const qs: Record<string, any> = {};
	if (timeout != null) qs.timeout = timeout;
	if (memory != null) qs.memory = memory;
	if (build) qs.build = build;
	qs.waitForFinish = 0; // always start run without waiting

	const apiResult = await apiRequest.call(this, {
		method: 'POST',
		uri: `/v2/actor-tasks/${actorTaskId}/runs`,
		body: input,
		qs,
	});

	if (!apiResult?.data?.id) {
		throw new NodeApiError(this.getNode(), {
			message: `Run ID not found after running the task`,
		});
	}

	if (!waitForFinish) {
		return { json: { ...apiResult.data } };
	}

	const runId = apiResult.data.id;
	const lastRunData = await pollRunStatus.call(this, runId);
	return { json: { ...lastRunData } };
}
