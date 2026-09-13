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
				operation: ['Run actor'],
			},
		},
	},
	{
		displayName: 'Actor',
		name: 'actorId',
		required: true,
		description:
			'The Actor to run. Choose from the list, or set via expression. ' +
			'For field-by-field input (Actor Schema mode), select a fixed Actor so its schema can be loaded.',
		default: { mode: 'list', value: '' },
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor'],
			},
		},
	},
	{
		displayName: 'Actor Input',
		name: 'actorInputMode',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Using JSON',
				value: 'json',
				description: 'Provide the full Actor input as a JSON object.',
			},
			{
				name: 'Using Actor Schema',
				value: 'schema',
				description:
					'Show separate fields from the Actor’s input schema. Requires a fixed Actor selection (recommended for AI Agent tools).',
			},
		],
		default: 'json',
		description: 'How to provide input for the selected Actor.',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor'],
			},
		},
	},
	{
		displayName: 'Actor Input Fields',
		name: 'actorInput',
		type: 'resourceMapper',
		noDataExpression: true,
		default: { mappingMode: 'defineBelow', value: null },
		typeOptions: {
			loadOptionsDependsOn: ['actorId.value'],
			resourceMapper: {
				resourceMapperMethod: 'getActorInputFields',
				mode: 'add',
				valuesLabel: 'Actor input',
				fieldWords: { singular: 'input field', plural: 'input fields' },
				addAllFields: true,
				multiKeyMatch: false,
				supportAutoMap: false,
				noFieldsError:
					'No input fields loaded — select a fixed Actor first, or switch to "Using JSON".',
			},
		},
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor'],
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
			"Pass {} to use the Actor's default configuration. " +
			'Find the exact input schema for any Actor at https://console.apify.com',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor'],
				actorInputMode: ['json'],
			},
		},
	},
	{
		displayName: 'Wait for Finish',
		name: 'waitForFinish',
		description:
			'Whether or not to wait for the run to finish before continuing. If true, the node will wait for the run to complete (successfully or not) before moving to the next node. Note: The maximum time the workflow will wait is limited by the workflow timeout setting in your n8n configuration.',
		default: true,
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor'],
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
				operation: ['Run actor'],
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
				operation: ['Run actor'],
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
				operation: ['Run actor'],
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
				operation: ['Run actor'],
			},
		},
	},
];
