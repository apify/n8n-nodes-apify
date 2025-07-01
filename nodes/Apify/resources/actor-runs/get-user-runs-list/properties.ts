import { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
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
				operation: ['Get user runs list'],
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
				operation: ['Get user runs list'],
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
				operation: ['Get user runs list'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		description: `Return only runs with the provided terminal status ([available
statuses](https://docs.apify.com/platform/actors/running/runs-and-builds#lifecycle))`,
		default: 'SUCCEEDED',
		type: 'options',
		options: [
			{ name: 'SUCCEEDED', value: 'SUCCEEDED' },
			{ name: 'FAILED', value: 'FAILED' },
			{ name: 'TIMED-OUT', value: 'TIMED-OUT' },
			{ name: 'ABORTED', value: 'ABORTED' },
		],
		displayOptions: {
			show: {
				resource: ['Actor runs'],
				operation: ['Get user runs list'],
			},
		},
	},
];
