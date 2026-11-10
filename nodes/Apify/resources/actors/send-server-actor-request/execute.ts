import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callServerActor } from '../../serverActor';

export async function sendServerActorRequest(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	return await callServerActor.call(this, i);
}
