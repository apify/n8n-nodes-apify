import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

import { name as datasetsResourceName } from './index';
import { name as getItemsOperationName } from './get-items';
import { getItems } from './get-items/execute';

export async function datasetsRouter(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const resource = this.getNodeParameter('resource', i);
	const operation = this.getNodeParameter('operation', i);

	if (resource !== datasetsResourceName) {
		throw new NodeOperationError(
			this,
			`Resource ${resource} is not valid for ${datasetsResourceName}. Please use correct resource.`,
		);
	}

	switch (operation) {
		case getItemsOperationName:
			return await getItems.call(this, i);

		default:
			throw new NodeOperationError(
				this,
				`Operation ${operation} not found. Please use correct operation.`,
			);
	}
}
