import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { getAuthedApifyClient } from '../../../helpers/apify-client';

export async function getRun(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
	const runId = this.getNodeParameter('runId', i) as { value: string };

	if (!runId) {
		throw new NodeOperationError(this, 'Run ID is required');
	}

	const client = await getAuthedApifyClient.call(this);

	try {
		const run = await client.run(runId.value).get();

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
