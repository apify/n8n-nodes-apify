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

import { INodeProperties } from 'n8n-workflow';

// @ts-ignore
import * as helpers from '../helpers';

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

const extraProperties: INodeProperties[] = [
	{
		displayName: 'Use Custom Body',
		name: 'useCustomBody',
		type: 'boolean',
		description: 'Whether to use a custom body',
		default: false,
		displayOptions: {
			hide: {
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
		routing: {
			request: {
				body: {
					customBody: '={{JSON.parse($value)}}',
				},
			},
			send: {
				preSend: [helpers.hooks.preSendActionCustonBody],
			},
		},
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor'],
			},
		},
	},
	{
		displayName: 'Custom Body',
		name: 'customBody',
		type: 'json',
		default:
			'{\n  "startUrls": [\n    {\n      "url": "https://docs.apify.com/academy/web-scraping-for-beginners"\n    }\n  ],\n  "crawlerType": "cheerio",\n  "maxCrawlDepth": 0,\n  "maxCrawlPages": 1,\n  "maxResults": 1,\n  "proxyConfiguration": {\n    "useApifyProxy": true\n  },\n  "removeCookieWarnings": true,\n  "saveHtml": true,\n  "saveMarkdown": true\n}',
		description: 'Custom body to send',
		routing: {
			request: {
				body: {
					customBody: '={{JSON.parse($value)}}',
				},
			},
			send: {
				preSend: [helpers.hooks.preSendActionCustonBody],
			},
		},
		displayOptions: {
			show: {
				useCustomBody: [true],
				resource: ['Actors'],
				operation: ['Scrape single URL'],
			},
		},
	},
	{
		displayName: 'Custom Body',
		name: 'customBody',
		type: 'json',
		default: '{}',
		description: 'Custom body to send',
		routing: {
			request: {
				body: {
					customBody: '={{JSON.parse($value)}}',
				},
			},
			send: {
				preSend: [helpers.hooks.preSendActionCustonBody],
			},
		},
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
