import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { apiRequest, pollRunStatus } from '../../genericFunctions';

export async function runTaskAndGetDataset(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const actorTaskId = this.getNodeParameter('actorTaskId', i, undefined, {
		extractValue: true,
	}) as string;
	const input = this.getNodeParameter('customBody', i, {}) as object;
	const timeout = this.getNodeParameter('timeout', i, null) as number | null;
	const memory = this.getNodeParameter('memory', i, null) as number | null;
	const build = this.getNodeParameter('build', i, '') as string;

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

	const runId = apiResult.data.id;
	const lastRunData = await pollRunStatus.call(this, runId);

	if (!lastRunData?.defaultDatasetId) {
		throw new NodeApiError(this.getNode(), {
			message: `Run ${runId} did not create a dataset`,
		});
	}

	if (lastRunData?.status !== 'SUCCEEDED') {
		return {
			json: {
				runResult: lastRunData,
			},
		};
	}

	const datasetItems = await apiRequest.call(this, {
		method: 'GET',
		uri: `/v2/datasets/${lastRunData.defaultDatasetId}/items`,
		qs: { format: 'json' },
	});

	return {
		json: {
			runResult: lastRunData,
			datasetItems: datasetItems,
		},
	};
}
