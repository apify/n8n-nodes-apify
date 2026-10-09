import { INodeProperties } from 'n8n-workflow';

import * as helpers from '../../../helpers';

export const properties: INodeProperties[] = [
	{
		displayName: 'Actor Source',
		name: 'actorSource',
		type: 'hidden',
		default: 'recentlyUsed',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor and get dataset'],
			},
		},
	},
	{
		displayName: 'Actor',
		name: 'actorId',
		required: true,
		description:
			'The ID of the Actor to run, in the format "username~actor-name" (e.g. "apify~web-scraper") ' +
			'or as a plain actor ID. Browse available Actors at https://apify.com/store',
		default: 'janedoe~my-actor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor and get dataset'],
			},
		},
	},
	{
		displayName: 'Input Mode',
		name: 'actorInputMode',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'JSON',
				value: 'json',
				description: 'Provide the whole Actor input as a JSON object',
			},
			{
				name: 'Schema Fields',
				value: 'schema',
				description:
					"Fill in fields loaded from the Actor's input schema. Requires an Actor selected from the list, by URL or by ID.",
			},
		],
		default: 'json',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor and get dataset'],
			},
		},
	},
	{
		displayName: 'Input Fields',
		name: 'actorInput',
		type: 'resourceMapper',
		noDataExpression: true,
		default: {
			mappingMode: 'defineBelow',
			value: null,
		},
		typeOptions: {
			loadOptionsDependsOn: ['actorId.value'],
			resourceMapper: {
				resourceMapperMethod: 'getActorInputFields',
				mode: 'add',
				valuesLabel: 'Actor Input',
				fieldWords: {
					singular: 'input field',
					plural: 'input fields',
				},
				addAllFields: true,
				multiKeyMatch: false,
				supportAutoMap: false,
			},
		},
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor and get dataset'],
				actorInputMode: ['schema'],
			},
		},
	},
	{
		displayName: 'Input JSON',
		name: 'customBody',
		type: 'json',
		default: '{}',
		description:
			'JSON input for the Actor. Structure depends on the specific Actor being run. ' +
			'For web scrapers, common fields include: startUrls (array of {"url": "..."} objects), ' +
			'maxCrawlPages (number, limits pages crawled), and proxyConfiguration ({"useApifyProxy": true}). ' +
			"Inputs you leave out (e.g. {}) use the Actor's input schema defaults; required inputs without a default must be provided. " +
			'Find the exact input schema for any Actor at https://console.apify.com',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor and get dataset'],
				actorInputMode: ['json'],
			},
		},
	},
	{
		displayName: 'Timeout',
		name: 'timeout',
		description: `Optional timeout for the run, in seconds. By default, the run uses a
timeout specified in the default run configuration for the Actor.`,
		default: null,
		type: 'number',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor and get dataset'],
			},
		},
	},
	{
		displayName: 'Memory',
		name: 'memory',
		description:
			'Memory limit for the run, in megabytes. The amount of memory can be set to one of the available options. By default, the run uses a memory limit specified in the default run configuration for the Actor.',
		default: 1024,
		type: 'options',
		options: helpers.consts.memoryOptions,
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor and get dataset'],
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
				resource: ['Actors'],
				operation: ['Run actor and get dataset'],
			},
		},
	},
	{
		displayName: 'Build Tag',
		name: 'build',
		description: `Specifies the Actor build tag to run. By default, the run uses the build specified in the default run
configuration for the Actor (typically \`latest\`).`,
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor and get dataset'],
			},
		},
	},
];
