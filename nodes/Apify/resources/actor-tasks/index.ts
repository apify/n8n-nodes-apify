import { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import { runHooks } from './hooks';

import * as runTask from './run-task';

const operations: INodePropertyOptions[] = [runTask.option];

export const name = 'Actor tasks';

const operationSelect: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['Actor tasks'],
		},
	},
	default: '',
};

// overwrite the options of the operationSelect
operationSelect.options = operations;

// set the default operation
operationSelect.default = operations.length > 0 ? operations[0].value : '';

export const rawProperties: INodeProperties[] = [operationSelect, ...runTask.properties];

const { properties, methods } = runHooks(rawProperties);

export { properties, methods };
