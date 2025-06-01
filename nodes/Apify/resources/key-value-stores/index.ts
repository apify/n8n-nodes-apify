import { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import { runHooks } from './hooks';

import * as getKeyValueStoreRecord from './get-key-value-store-record';

const operations: INodePropertyOptions[] = [getKeyValueStoreRecord.option];

const name = 'Key-Value Stores';

const operationSelect: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['Key-Value Stores'],
		},
	},
	default: '',
};

// overwrite the options of the operationSelect
operationSelect.options = operations;

// set the default operation
operationSelect.default = operations.length > 0 ? operations[0].value : '';

export const rawProperties: INodeProperties[] = [
	operationSelect,
	...getKeyValueStoreRecord.properties,
];

const { properties, methods } = runHooks(rawProperties);

export { properties, methods, name };
