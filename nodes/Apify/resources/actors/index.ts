import { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import { runHooks } from './hooks';

import * as runActor from './run-actor';
import * as scrapeSingleUrl from './scrape-single-url';
import * as getLastRun from './get-last-run';

const operations: INodePropertyOptions[] = [
	runActor.option,
	scrapeSingleUrl.option,
	getLastRun.option,
];

export const name = 'Actors';

const operationSelect: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['Actors'],
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
	...runActor.properties,
	...scrapeSingleUrl.properties,
	...getLastRun.properties,
];

const { properties, methods } = runHooks(rawProperties);

export { properties, methods };
