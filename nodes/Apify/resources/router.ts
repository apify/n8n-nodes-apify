import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

import { name as actorRunResourceName } from './actor-runs';
import { name as actorTaskResourceName } from './actor-tasks';
import { name as actorResourceName } from './actors';
import { name as datasetResourceName } from './datasets';
import { name as keyValueStoreResourceName } from './key-value-stores';
import { actorRunsRouter } from './actor-runs/router';
import { actorTasksRouter } from './actor-tasks/router';
import { actorsRouter } from './actors/router';
import { datasetsRouter } from './datasets/router';
import { keyValueStoresRouter } from './key-value-stores/router';

export async function resourceRouter(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const resource = this.getNodeParameter('resource', 0);

	switch (resource) {
		case actorRunResourceName:
			return await actorRunsRouter.call(this, i);

		case actorTaskResourceName:
			return await actorTasksRouter.call(this, i);

		case actorResourceName:
			return await actorsRouter.call(this, i);

		case datasetResourceName:
			return await datasetsRouter.call(this, i);

		case keyValueStoreResourceName:
			return await keyValueStoresRouter.call(this, i);

		default:
			throw new NodeOperationError(this, `Resource ${resource} not found`);
	}
}
