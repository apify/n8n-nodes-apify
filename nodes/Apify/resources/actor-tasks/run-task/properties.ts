import { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Actor Task',
		name: 'actorTaskId',
		required: true,
		description: 'Task ID or a tilde-separated username and task name',
		default: 'janedoe~my-task',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Actor tasks'],
				operation: ['Run task'],
			},
		},
	},
	{
		displayName: 'Use Custom Body',
		name: 'useCustomBody',
		type: 'boolean',
		description: 'Whether to use a custom body',
		// default to false since Task should use task-defined input for its Actor
		default: false,
		displayOptions: {
			show: {
				resource: ['Actor tasks'],
				operation: ['Run task'],
			},
		},
	},
	{
		displayName: 'Input (JSON)',
		name: 'customBody',
		type: 'json',
		default: '{}',
		description: 'Custom body to send',
		displayOptions: {
			show: {
				useCustomBody: [true],
				resource: ['Actor tasks'],
				operation: ['Run task'],
			},
		},
	},
	{
		displayName: 'Wait for Finish',
		name: 'waitForFinish',
		description:
			"The maximum number of seconds the server waits for the run to finish. By default, the server doesn't wait for the run to finish and returns immediately. The maximum value is 60 seconds.",
		default: null,
		type: 'number',
		typeOptions: {
			maxValue: 60,
		},
		displayOptions: {
			show: {
				resource: ['Actor tasks'],
				operation: ['Run task'],
			},
		},
	},
	{
		displayName: 'Timeout',
		name: 'timeout',
		description: `Optional timeout for the run, in seconds. By default, the run uses a
timeout specified in the task settings.`,
		default: null,
		type: 'number',
		displayOptions: {
			show: {
				resource: ['Actor tasks'],
				operation: ['Run task'],
			},
		},
	},
	{
		displayName: 'Memory',
		name: 'memory',
		description:
			'Memory limit for the run, in megabytes. The amount of memory can be set to one of the available options. By default, the run uses a memory limit specified in the task settings.',
		default: 1024,
		type: 'options',
		options: [
			{ name: '128 MB', value: 128 },
			{ name: '256 MB', value: 256 },
			{ name: '512 MB', value: 512 },
			{ name: '1024 MB (1 GB)', value: 1024 },
			{ name: '2048 MB (2 GB)', value: 2048 },
			{ name: '4096 MB (4 GB)', value: 4096 },
			{ name: '8192 MB (8 GB)', value: 8192 },
			{ name: '16384 MB (16 GB)', value: 16384 },
			{ name: '32768 MB (32 GB)', value: 32768 },
		],
		displayOptions: {
			show: {
				resource: ['Actor tasks'],
				operation: ['Run task'],
			},
		},
	},
	{
		displayName: 'Build',
		name: 'build',
		description: `Specifies the Actor build to run. It can be either a build tag or build
number. By default, the run uses the build specified in the task
settings (typically \`latest\`).`,
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Actor tasks'],
				operation: ['Run task'],
			},
		},
	},
];
