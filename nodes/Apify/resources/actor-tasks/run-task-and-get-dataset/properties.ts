import { INodeProperties } from 'n8n-workflow';

import * as helpers from '../../../helpers';

export const properties: INodeProperties[] = [
	{
		displayName: 'Actor Task',
		name: 'actorTaskId',
		required: true,
		description: 'The ID of the task to run, in the format "username~task-name" or as a plain task ID. Manage your saved tasks in Apify Console at https://console.apify.com.',
		default: 'janedoe~my-task',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Actor tasks'],
				operation: ['Run task and get dataset'],
			},
		},
	},
	{
		displayName: 'Use Custom Body',
		name: 'useCustomBody',
		type: 'boolean',
		description: "Whether to override the task's saved input with custom JSON provided below",
		// default to false since Task should use task-defined input for its Actor
		default: false,
		displayOptions: {
			show: {
				resource: ['Actor tasks'],
				operation: ['Run task and get dataset'],
			},
		},
	},
	{
		displayName: 'Input (JSON)',
		name: 'customBody',
		type: 'json',
		default: '{}',
		description:
			'JSON input that overrides the input saved in this task. The exact structure depends on the Actor behind the task — consult its input schema for valid fields. ' +
			'Common fields for web-scraping Actors include "startUrls" (array of {"url": "https://..."} objects), ' +
			'"maxCrawlPages" or "maxRequestsPerCrawl" (number limiting how much is crawled), and "proxyConfiguration" ({"useApifyProxy": true}). ' +
			'Find the exact input schema in Apify Console at https://console.apify.com',
		displayOptions: {
			show: {
				useCustomBody: [true],
				resource: ['Actor tasks'],
				operation: ['Run task and get dataset'],
			},
		},
	},
	{
		displayName: 'Timeout',
		name: 'timeout',
		description: `Optional timeout for the run, in seconds. By default, the run uses a
timeout specified in the task settings.`,
		default: null,
		type: 'number',
		displayOptions: {
			show: {
				resource: ['Actor tasks'],
				operation: ['Run task and get dataset'],
			},
		},
	},
	{
		displayName: 'Memory',
		name: 'memory',
		description:
			'Memory limit for the run, in megabytes. The amount of memory can be set to one of the available options. By default, the run uses a memory limit specified in the task settings.',
		default: 1024,
		type: 'options',
		options: helpers.consts.memoryOptions,
		displayOptions: {
			show: {
				resource: ['Actor tasks'],
				operation: ['Run task and get dataset'],
			},
		},
	},
	{
		displayName: 'Maximum Cost per Run (USD)',
		name: 'maxTotalChargeUsd',
		description:
			'Maximum total amount in USD that the run may be charged. Applies to Actors with pay-per-event or pay-per-result pricing; the run is aborted once the limit is reached. Leave empty for no limit.',
		default: null,
		type: 'number',
		typeOptions: {
			minValue: 0,
		},
		displayOptions: {
			show: {
				resource: ['Actor tasks'],
				operation: ['Run task and get dataset'],
			},
		},
	},
	{
		displayName: 'Build Tag',
		name: 'build',
		description: `Specifies the Actor build tag to run. By default, the run uses the build specified in the task
settings (typically \`latest\`).`,
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Actor tasks'],
				operation: ['Run task and get dataset'],
			},
		},
	},
];
