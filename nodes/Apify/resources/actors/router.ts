import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

import { name as actorResourceName } from './index';
import { name as runActorOperationName } from './run-actor';
import { name as runActorAndGetDatasetOperationName } from './run-actor-and-get-dataset';
import { scrapeSingleUrlName as scrapeSingleUrlOperationName } from './scrape-single-url';
import { name as getLastRunOperationName } from './get-last-run';
import { runActor } from './run-actor/execute';
import { scrapeSingleUrl } from './scrape-single-url/execute';
import { getLastRun } from './get-last-run/execute';
import { runActorAndGetDataset } from './run-actor-and-get-dataset/execute';

export async function actorsRouter(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData | INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', i);
	const operation = this.getNodeParameter('operation', i);

	if (resource !== actorResourceName) {
		throw new NodeOperationError(
			this.getNode(),
			`Resource ${resource} is not valid for ${actorResourceName}. Please use correct resource.`,
		);
	}

	switch (operation) {
		case runActorOperationName:
			return await runActor.call(this, i);
		case runActorAndGetDatasetOperationName:
			return await runActorAndGetDataset.call(this, i);
		case scrapeSingleUrlOperationName:
			return await scrapeSingleUrl.call(this, i);
		case getLastRunOperationName:
			return await getLastRun.call(this, i);

		default:
			throw new NodeOperationError(
				this.getNode(),
				`Operation ${operation} not found. Please use correct operation.`,
			);
	}
}
