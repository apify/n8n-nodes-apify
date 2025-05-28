import { INodeProperties } from 'n8n-workflow';

import { aggregateNodeMethods } from '../helpers/methods';
import { runHooks } from './hooks';

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
				name: 'Key-Value Store',
				value: 'Key-Value Stores',
			},
		],
		default: 'Key-Value Stores',
	},
];

const extraProperties: INodeProperties[] = [
	// TODO: add extra properties here
];

const rawProperties: INodeProperties[] = [
	...authenticationProperties,
	...resourceSelect,
	...keyValueStores.properties,
	...extraProperties,
];

const { properties, methods: selfMethods } = runHooks(rawProperties);

const methods = aggregateNodeMethods([selfMethods, keyValueStores.methods]);

export { properties, methods };
