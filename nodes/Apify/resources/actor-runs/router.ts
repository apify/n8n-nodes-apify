import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

import { name as actorRunResourceName } from './index';
import { name as getRunOperationName } from './get-run';
import { name as getUserRunsListOperationName } from './get-user-runs-list';
import { getRun } from './get-run/execute';
import { getUserRunsList } from './get-user-runs-list/execute';

export async function actorRunsRouter(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const resource = this.getNodeParameter('resource', i);
	const operation = this.getNodeParameter('operation', i);

	if (resource !== actorRunResourceName) {
		throw new NodeOperationError(
			this,
			`Resource ${resource} is not valid for ${actorRunResourceName}. Please use correct resource.`,
		);
	}

	switch (operation) {
		case getRunOperationName:
			return await getRun.call(this, i);

		case getUserRunsListOperationName:
			return await getUserRunsList.call(this, i);

		default:
			throw new NodeOperationError(
				this,
				`Operation ${operation} not found. Please use correct operation.`,
			);
	}
}
