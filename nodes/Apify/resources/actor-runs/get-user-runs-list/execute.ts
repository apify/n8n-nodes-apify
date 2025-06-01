import { IExecuteFunctions, INodeExecutionData, NodeApiError } from 'n8n-workflow';
import { ActorRun } from 'apify-client';
import { getAuthedApifyClient } from '../../../helpers/apify-client';

export async function getUserRunsList(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const offset = this.getNodeParameter('offset', i, 0) as number;
	const limit = this.getNodeParameter('limit', i, 50) as number;
	const desc = this.getNodeParameter('desc', i) as boolean;
	const status = this.getNodeParameter('status', i) as ActorRun['status'];

	const client = await getAuthedApifyClient.call(this);

	try {
		const runsList = await client.runs().list({
			limit,
			offset,
			desc,
			status: status,
		});

		return { json: { runs: runsList.items } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
