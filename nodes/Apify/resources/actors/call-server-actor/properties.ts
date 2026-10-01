import { INodeProperties } from 'n8n-workflow';

import { serverEndpointProperties } from '../../serverActor';

const displayOptions = {
	show: {
		resource: ['Actors'],
		operation: ['Call Server Actor'],
	},
};

export const properties: INodeProperties[] = [
	{
		displayName: 'Actor',
		name: 'actorId',
		required: true,
		description:
			'The Server Actor to call. Server Actors answer HTTP requests instead of starting a run.',
		default: 'janedoe~my-actor',
		type: 'string',
		displayOptions,
	},
	...serverEndpointProperties(displayOptions),
];
