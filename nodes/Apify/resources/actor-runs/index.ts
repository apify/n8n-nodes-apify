import { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import { runHooks } from './hooks';

import * as getUserRunsList from './get-user-runs-list';
import * as getRun from './get-run';

const operations: INodePropertyOptions[] = [getUserRunsList.option, getRun.option];

const name = 'Actor runs';

const operationSelect: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['Actor runs'],
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
	...getUserRunsList.properties,
	...getRun.properties,
];

const { properties, methods } = runHooks(rawProperties);

export { properties, methods, name };
