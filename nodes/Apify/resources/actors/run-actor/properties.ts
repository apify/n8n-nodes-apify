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
				operation: ['Run actor'],
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
				operation: ['Run actor'],
			},
		},
	},
	{
		displayName: 'Input JSON',
		name: 'customBody',
		type: 'json',
		default: '{}',
		description:
			'JSON input for the Actor run, which you can find on the Actor input page in Apify Console. If empty, the run uses the input specified in the default run configuration.',
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
		description: `Memory limit for the run, in megabytes. The amount of memory can be set
to a power of 2 with a minimum of 128. By default, the run uses a memory
limit specified in the default run configuration for the Actor.`,
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
	{
		displayName: 'Wait for Finish',
		name: 'waitForFinish',
		description:
			'Whether to wait for the run to finish before continuing. If true, the node will wait for the run to complete (successfully or not) before moving to the next node. Note: The maximum time the workflow will wait is limited by the workflow timeout setting in your n8n configuration.',
		default: true,
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor'],
			},
		},
	},
];
