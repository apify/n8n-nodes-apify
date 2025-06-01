import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { getAuthedApifyClient } from '../../../helpers/apify-client';

export async function getLastRun(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
	const actorId = this.getNodeParameter('actorId', i) as { value: string };

	if (!actorId) {
		throw new NodeOperationError(this, 'Actor ID is required');
	}

	const client = await getAuthedApifyClient.call(this);

	try {
		const lastRun = await client.actor(actorId.value).lastRun().get();

		return { json: { ...lastRun } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
