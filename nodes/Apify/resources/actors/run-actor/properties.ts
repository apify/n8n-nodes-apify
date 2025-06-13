import { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'POST /v2/acts/{actorId}/runs',
		name: 'operation',
		type: 'notice',
		typeOptions: {
			theme: 'info',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor'],
			},
		},
	},
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
		description: "Actor ID or a tilde-separated owner's username and Actor name",
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
		displayName: 'Build',
		name: 'build',
		description: `Specifies the Actor build to run. It can be either a build tag or build
number. By default, the run uses the build specified in the default run
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
		displayName: 'Wait For Finish',
		name: 'waitForFinish',
		description:
			'The maximum number of seconds the server waits for the run to finish. By default the server do not wait for the run to finish and returns immediately. The maximum value is 60 seconds.',
		default: null,
		type: 'number',
		typeOptions: {
			minValue: 0,
			maxValue: 60,
		},
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Run actor'],
			},
		},
	},
];
