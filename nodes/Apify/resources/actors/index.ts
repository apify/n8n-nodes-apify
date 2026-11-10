import { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import { runHooks } from './hooks';

import * as runActor from './run-actor';
import * as webFetch from './web-fetch';
import * as scrapeSingleUrl from './scrape-single-url';
import * as getLastRun from './get-last-run';
import * as runActorAndGetDataset from './run-actor-and-get-dataset';
import * as sendServerActorRequest from './send-server-actor-request';

export const name = 'Actors';

const operationsV1: INodePropertyOptions[] = [
	runActor.option,
	runActorAndGetDataset.option,
	sendServerActorRequest.option,
	webFetch.option,
	scrapeSingleUrl.option,
	getLastRun.option,
];

const operationsV2: INodePropertyOptions[] = [
	runActor.option,
	runActorAndGetDataset.option,
	sendServerActorRequest.option,
	webFetch.option,
	getLastRun.option,
];

const operationSelectV1: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['Actors'],
			'@version': [1],
		},
	},
	default: '',
};

const operationSelectV2: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['Actors'],
			'@version': [2],
		},
	},
	default: '',
};

operationSelectV1.default = operationsV1.length > 0 ? operationsV1[0].value : '';
operationSelectV1.options = operationsV1;
operationSelectV2.default = operationsV2.length > 0 ? operationsV2[0].value : '';
operationSelectV2.options = operationsV2;

export const rawProperties: INodeProperties[] = [
	operationSelectV2,
	operationSelectV1,
	...runActor.properties,
	...runActorAndGetDataset.properties,
	...sendServerActorRequest.properties,
	...webFetch.properties,
	...scrapeSingleUrl.properties,
	...getLastRun.properties,
];

const { properties, methods } = runHooks(rawProperties);

export { properties, methods };
