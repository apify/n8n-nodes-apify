import { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Actor',
		name: 'userActorId',
		required: true,
		description: 'Actor ID or a tilde-separated username and Actor name',
		default: 'janedoe~my-actor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Actor runs'],
				operation: ['Get runs'],
			},
		},
	},
	{
		displayName: 'Offset',
		name: 'offset',
		description: `Number of array elements that should be skipped at the start. The
default value is \`0\`.`,
		default: 0,
		type: 'number',
		displayOptions: {
			show: {
				resource: ['Actor runs'],
				operation: ['Get runs'],
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
				resource: ['Actor runs'],
				operation: ['Get runs'],
			},
		},
	},
	{
		displayName: 'Desc',
		name: 'desc',
		description: `Whether the objects are sorted by the \`startedAt\` field in
descending order. By default, they are sorted in ascending order.`,
		default: true,
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['Actor runs'],
				operation: ['Get runs'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		description: `Return only runs with the provided terminal status, available
statuses: https://docs.apify.com/platform/actors/running/runs-and-builds#lifecycle`,
		default: 'SUCCEEDED',
		type: 'options',
		options: [
			{ name: 'ABORTED', value: 'ABORTED' },
			{ name: 'ABORTING', value: 'ABORTING' },
			{ name: 'FAILED', value: 'FAILED' },
			{ name: 'READY', value: 'READY' },
			{ name: 'RUNNING', value: 'RUNNING' },
			{ name: 'SUCCEEDED', value: 'SUCCEEDED' },
			{ name: 'TIMED-OUT', value: 'TIMED-OUT' },
			{ name: 'TIMING-OUT', value: 'TIMING-OUT' },
		],
		displayOptions: {
			show: {
				resource: ['Actor runs'],
				operation: ['Get runs'],
			},
		},
	},
];
