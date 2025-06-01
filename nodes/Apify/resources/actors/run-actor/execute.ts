import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { getAuthedApifyClient } from '../../../helpers/apify-client';

export async function runActor(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
	const actorId = this.getNodeParameter('actorId', i) as { value: string };
	const timeout = this.getNodeParameter('timeout', i) as number | null;
	const memory = this.getNodeParameter('memory', i) as number | null;
	const build = this.getNodeParameter('build', i) as string | null;
	const waitForFinish = this.getNodeParameter('waitForFinish', i) as number | null;
	const rawStringifiedInput = this.getNodeParameter('customBody', i, '{}') as string;

	let input: any;

	if (rawStringifiedInput) {
		input = JSON.parse(rawStringifiedInput);
	} else {
		throw new NodeOperationError(this, `Could not parse custom body: ${rawStringifiedInput}`);
	}

	if (!actorId) {
		throw new NodeOperationError(this, 'Actor ID is required');
	}

	const client = await getAuthedApifyClient.call(this);

	try {
		const run = await client.actor(actorId.value).call(input, {
			timeout: timeout == null ? undefined : timeout,
			memory: memory == null ? undefined : memory,
			build: build == null ? undefined : build,
			waitSecs: waitForFinish == null ? undefined : waitForFinish,
		});

		if (!run) {
			throw new NodeApiError(this.getNode(), {
				message: `Actor run for ${actorId.value} not found`,
			});
		}

		return { json: { ...run } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error, {
			// this message helps the user tailor the input body in case there is validation error
			message: error.message,
		});
	}
}
