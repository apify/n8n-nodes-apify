import { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Dataset ID',
		name: 'datasetId',
		required: true,
		description: 'Dataset ID or `username~dataset-name`',
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Datasets'],
				operation: ['Get items'],
			},
		},
	},
	{
		displayName: 'Offset',
		name: 'offset',
		description: 'Number of items that should be skipped at the start. The default value is `0`.',
		default: null,
		type: 'number',
		displayOptions: {
			show: {
				resource: ['Datasets'],
				operation: ['Get items'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		description: 'Max number of results to return',
		default: 50,
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['Datasets'],
				operation: ['Get items'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['Datasets'],
				operation: ['Get items'],
			},
		},
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'string',
				default: '',
				description:
					'Comma-separated list of fields to include in the results. Only these fields will be returned.',
			},
			{
				displayName: 'Omit',
				name: 'omit',
				type: 'string',
				default: '',
				description:
					'Comma-separated list of fields to exclude from the results. If a field appears in both "fields" and "omit", it will be excluded.',
			},
		],
	},
];
