import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

import { name as keyValueStoreResourceName } from './index';
import { name as getKeyValueStoreRecordOperationName } from './get-key-value-store-record';
import { getKeyValueStoreRecord } from './get-key-value-store-record/execute';

export async function keyValueStoresRouter(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const resource = this.getNodeParameter('resource', i);
	const operation = this.getNodeParameter('operation', i);

	if (resource !== keyValueStoreResourceName) {
		throw new NodeOperationError(
			this.getNode(),
			`Resource ${resource} is not valid for ${keyValueStoreResourceName}. Please use correct resource.`,
		);
	}

	switch (operation) {
		case getKeyValueStoreRecordOperationName:
			return await getKeyValueStoreRecord.call(this, i);

		default:
			throw new NodeOperationError(this.getNode(), `Operation ${operation} not found`);
	}
}
