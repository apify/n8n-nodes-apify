import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { apiRequest } from '../../../resources/genericFunctions';

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

	const query: Record<string, any> = {};
	if (timeout != null) query.timeout = timeout;
	if (memory != null) query.memory = memory;
	if (build != null) query.build = build;
	if (waitForFinish != null) query.waitForFinish = waitForFinish;

	try {
		const run = await apiRequest.call(this, {
			method: 'POST',
			uri: `/v2/acts/${actorId.value}/runs`,
			body: input,
			qs: query,
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
