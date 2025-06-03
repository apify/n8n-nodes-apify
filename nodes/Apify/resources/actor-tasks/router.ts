import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

import { name as actorTaskResourceName } from './index';
import { name as runTaskOperationName } from './run-task';
import { runTask } from './run-task/execute';

export async function actorTasksRouter(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const resource = this.getNodeParameter('resource', i);
	const operation = this.getNodeParameter('operation', i);

	if (resource !== actorTaskResourceName) {
		throw new NodeOperationError(
			this,
			`Resource ${resource} is not valid for ${actorTaskResourceName}. Please use correct resource.`,
		);
	}

	switch (operation) {
		case runTaskOperationName:
			return await runTask.call(this, i);

		default:
			throw new NodeOperationError(
				this,
				`Operation ${operation} not found. Please use correct operation.`,
			);
	}
}
