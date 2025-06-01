import { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'GET /v2/datasets/{datasetId}/items',
		name: 'operation',
		type: 'notice',
		typeOptions: {
			theme: 'info',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['Datasets'],
				operation: ['Get items'],
			},
		},
	},
	{
		displayName: 'Dataset ID',
		name: 'datasetId',
		required: true,
		description: 'Dataset ID or `username~dataset-name`',
		default: 'WkzbQMuFYuamGv3YF',
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
];
