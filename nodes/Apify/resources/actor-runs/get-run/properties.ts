import { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Run ID',
		name: 'runId',
		required: true,
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Actor runs'],
				operation: ['Get run'],
			},
		},
	},
];
