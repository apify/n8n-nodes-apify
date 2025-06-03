/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */

import { INodeProperties } from 'n8n-workflow';

import { aggregateNodeMethods } from '../helpers/methods';
import { runHooks } from './hooks';

import * as actors from './actors';
import * as actorTasks from './actor-tasks';
import * as actorRuns from './actor-runs';
import * as datasets from './datasets';
import * as keyValueStores from './key-value-stores';

const authenticationProperties: INodeProperties[] = [];

const resourceSelect: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Actor',
				value: 'Actors',
			},
			{
				name: 'Actor Task',
				value: 'Actor tasks',
			},
			{
				name: 'Actor Run',
				value: 'Actor runs',
			},
			{
				name: 'Dataset',
				value: 'Datasets',
			},
			{
				name: 'Key-Value Store',
				value: 'Key-Value Stores',
			},
		],
		default: 'Actors',
	},
];

// TODO: consider moving this to the operation specific properties
const extraProperties: INodeProperties[] = [
	{
		displayName: 'Use Custom Body',
		name: 'useCustomBody',
		type: 'boolean',
		description: 'Whether to use a custom body',
		// default to false since Task should use task-defined input for its Actor
		default: false,
		displayOptions: {
			show: {
				resource: ['Actor tasks'],
				operation: ['Run task'],
			},
		},
	},
	{
		displayName: 'Input (JSON)',
		name: 'customBody',
		type: 'json',
		default: '{}',
		description: 'Custom body to send',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor'],
			},
		},
	},
	{
		displayName: 'Input (JSON)',
		name: 'customBody',
		type: 'json',
		default: '{}',
		description: 'Custom body to send',
		displayOptions: {
			show: {
				useCustomBody: [true],
				resource: ['Actor tasks'],
				operation: ['Run task'],
			},
		},
	},
];

const rawProperties: INodeProperties[] = [
	...authenticationProperties,
	...resourceSelect,
	...actors.properties,
	...actorTasks.properties,
	...actorRuns.properties,
	...datasets.properties,
	...keyValueStores.properties,
	...extraProperties,
];

const { properties, methods: selfMethods } = runHooks(rawProperties);

const methods = aggregateNodeMethods([
	selfMethods,
	actors.methods,
	actorTasks.methods,
	actorRuns.methods,
	datasets.methods,
	keyValueStores.methods,
]);

export { properties, methods };
