import { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Actor Source',
		name: 'actorSource',
		type: 'hidden',
		default: 'recentlyUsed',
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
		description: 'Actor ID or a tilde-separated username and Actor name',
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
		description:
			'Return only runs with the provided status. See the dropdown options or the Apify documentation https://docs.apify.com/platform/actors/running/runs-and-builds#lifecycle.',
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
				resource: ['Actors'],
				operation: ['Get last run'],
			},
		},
	},
];
