import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

import { name as actorResourceName } from './index';
import { name as runActorOperationName } from './run-actor';
import { scrapeSingleUrlName as scrapeSingleUrlOperationName } from './scrape-single-url';
import { name as getLastRunOperationName } from './get-last-run';
import { runActor } from './run-actor/execute';
import { scrapeSingleUrl } from './scrape-single-url/execute';
import { getLastRun } from './get-last-run/execute';

export async function actorsRouter(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const resource = this.getNodeParameter('resource', i);
	const operation = this.getNodeParameter('operation', i);

	if (resource !== actorResourceName) {
		throw new NodeOperationError(
			this,
			`Resource ${resource} is not valid for ${actorResourceName}. Please use correct resource.`,
		);
	}

	switch (operation) {
		case runActorOperationName:
			return await runActor.call(this, i);
		case scrapeSingleUrlOperationName:
			return await scrapeSingleUrl.call(this, i);
		case getLastRunOperationName:
			return await getLastRun.call(this, i);

		default:
			throw new NodeOperationError(
				this,
				`Operation ${operation} not found. Please use correct operation.`,
			);
	}
}
