import { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'GET /v2/actor-runs/{runId}',
		name: 'operation',
		type: 'notice',
		typeOptions: {
			theme: 'info',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['Actor runs'],
				operation: ['Get run'],
			},
		},
	},
	{
		displayName: 'Run ID',
		name: 'runId',
		required: true,
		default: '3KH8gEpp4d8uQSe8T',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Actor runs'],
				operation: ['Get run'],
			},
		},
	},
];
