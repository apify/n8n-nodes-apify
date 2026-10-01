import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { callServerActor as callServerActorEndpoint } from '../../serverActor';

export async function callServerActor(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	return await callServerActorEndpoint.call(this, i);
}
