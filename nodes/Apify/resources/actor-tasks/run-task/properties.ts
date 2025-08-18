import { INodeProperties } from 'n8n-workflow';

import * as helpers from '../../../helpers';

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
			'Whether to wait for the run to finish. If true, the node will poll the run status until it reaches a terminal state (SUCCEEDED, FAILED, TIMED-OUT, ABORTED) or 5 minutes have passed. If false, the node will return immediately after starting the run.',
		default: true,
		type: 'boolean',
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
		options: helpers.consts.memoryOptions,
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
