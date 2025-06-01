import { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'GET /v2/acts/{actorId}/runs/last',
		name: 'operation',
		type: 'notice',
		typeOptions: {
			theme: 'info',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Get last run'],
			},
		},
	},
	{
		displayName: 'Actor',
		name: 'actorId',
		required: true,
		description: "Actor ID or a tilde-separated owner's username and Actor name",
		default: 'janedoe~my-actor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Get last run'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		description: 'Filter for the run status',
		default: 'SUCCEEDED',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Get last run'],
			},
		},
	},
];
