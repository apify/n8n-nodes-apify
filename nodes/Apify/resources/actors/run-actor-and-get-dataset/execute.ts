import { IExecuteFunctions, INodeExecutionData, NodeApiError } from 'n8n-workflow';
import { apiRequest } from '../../genericFunctions';
import { executeActor } from '../../executeActor';

export async function runActorAndGetDataset(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const actorId = this.getNodeParameter('actorId', i, undefined, {
		extractValue: true,
	}) as string;
	const timeout = this.getNodeParameter('timeout', i) as number | null;
	const memory = this.getNodeParameter('memory', i) as number | null;
	const buildParam = this.getNodeParameter('build', i) as string | null;
	const rawStringifiedInput = this.getNodeParameter('customBody', i, '{}') as string | object;

	const { runId, lastRunData } = await executeActor.call(this, {
		actorId,
		timeout,
		memory,
		buildParam,
		rawStringifiedInput,
		waitForFinish: true,
	});

	if (!lastRunData?.defaultDatasetId) {
		throw new NodeApiError(this.getNode(), {
			message: `Run ${runId} did not create a dataset`,
		});
	}

	if (lastRunData?.status !== 'SUCCEEDED') {
		throw new NodeApiError(this.getNode(), {
			message: `Run ${runId} did not finish with status SUCCEEDED. Run status: ${lastRunData?.status}`,
		});
	}

	const datasetItems = await apiRequest.call(this, {
		method: 'GET',
		uri: `/v2/datasets/${lastRunData.defaultDatasetId}/items`,
		qs: { format: 'json' },
	});

	return this.helpers.returnJsonArray(datasetItems);
}
