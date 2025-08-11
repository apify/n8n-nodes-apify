import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

import { name as actorTaskResourceName } from './index';
import { name as runTaskOperationName } from './run-task';
import { name as runTaskAndGetDatasetOperationName } from './run-task-and-get-dataset';
import { runTask } from './run-task/execute';
import { runTaskAndGetDataset } from './run-task-and-get-dataset/execute';

export async function actorTasksRouter(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData | INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', i);
	const operation = this.getNodeParameter('operation', i);

	if (resource !== actorTaskResourceName) {
		throw new NodeOperationError(
			this.getNode(),
			`Resource ${resource} is not valid for ${actorTaskResourceName}. Please use correct resource.`,
		);
	}

	switch (operation) {
		case runTaskOperationName:
			return await runTask.call(this, i);

		case runTaskAndGetDatasetOperationName:
			return await runTaskAndGetDataset.call(this, i);

		default:
			throw new NodeOperationError(
				this.getNode(),
				`Operation ${operation} not found. Please use correct operation.`,
			);
	}
}
