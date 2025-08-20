import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { executeActor } from '../../executeActor';

export async function runActor(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
	const actorId = this.getNodeParameter('actorId', i, undefined, {
		extractValue: true,
	}) as string;
	const timeout = this.getNodeParameter('timeout', i) as number | null;
	const memory = this.getNodeParameter('memory', i) as number | null;
	const buildParam = this.getNodeParameter('build', i) as string | null;
	const waitForFinish = this.getNodeParameter('waitForFinish', i) as boolean;
	const rawStringifiedInput = this.getNodeParameter('customBody', i, '{}') as string | object;

	const { lastRunData } = await executeActor.call(this, {
		actorId,
		timeout,
		memory,
		buildParam,
		rawStringifiedInput,
		waitForFinish,
	});

	return {
		json: { ...lastRunData },
	};
}
