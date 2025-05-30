/* eslint-disable n8n-nodes-base/node-param-option-description-identical-to-name */
/* eslint-disable n8n-nodes-base/node-param-display-name-miscased-id */
/* eslint-disable n8n-nodes-base/node-param-display-name-miscased-id */
/* eslint-disable n8n-nodes-base/node-param-description-boolean-without-whether */
/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */

/**
 * The following code was generated create-n8n-nodes tool.
 *
 * This file was automatically generated and should not be edited.
 *
 * If changes are required, please refer to the templates and scripts in the repository.
 * Repository: https://github.com/oneflow-vn/create-n8n-nodes
 */

import { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import { runHooks } from './hooks';

import * as getListOfDatasets from './get-list-of-datasets';
import * as createDataset from './create-dataset';
import * as getDataset from './get-dataset';
import * as updateDataset from './update-dataset';
import * as deleteDataset from './delete-dataset';
import * as getItems from './get-items';
import * as putItems from './put-items';

const operations: INodePropertyOptions[] = [
	getListOfDatasets.option,
	createDataset.option,
	getDataset.option,
	updateDataset.option,
	deleteDataset.option,
	getItems.option,
	putItems.option,
];

export const name = 'Datasets';

const operationSelect: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['Datasets'],
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
	...getListOfDatasets.properties,
	...createDataset.properties,
	...getDataset.properties,
	...updateDataset.properties,
	...deleteDataset.properties,
	...getItems.properties,
	...putItems.properties,
];

const { properties, methods } = runHooks(rawProperties);

export { properties, methods };
