import { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'POST /v2/actor-tasks/{actorTaskId}/runs',
		name: 'operation',
		type: 'notice',
		typeOptions: {
			theme: 'info',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['Actor tasks'],
				operation: ['Run task'],
			},
		},
	},
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
		displayName: 'Wait for Finish',
		name: 'waitForFinish',
		description:
			"The maximum number of seconds the server waits for the run to finish. By default, the server doesn't wait for the run to finish and returns immediately. The maximum value is 60 seconds.",
		default: null,
		type: 'number',
		typeOptions: {
			maxValue: 60,
		},
		routing: {
			request: {
				qs: {
					waitForFinish: '={{ $value || $value === 0 ? $value : undefined }}',
				},
			},
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
		routing: {
			request: {
				qs: {
					timeout: '={{ $value || $value === 0 ? $value : undefined }}',
				},
			},
		},
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
		description: `Memory limit for the run, in megabytes. The amount of memory can be set
to a power of 2 with a minimum of 128. By default, the run uses a memory
limit specified in the task settings.`,
		default: null,
		type: 'number',
		routing: {
			request: {
				qs: {
					memory: '={{ $value }}',
				},
			},
		},
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
		routing: {
			request: {
				qs: {
					build: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: ['Actor tasks'],
				operation: ['Run task'],
			},
		},
	},
];
