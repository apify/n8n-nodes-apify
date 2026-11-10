import { INodeProperties } from 'n8n-workflow';

import { serverActorProperties } from '../../serverActor';

const show = {
	resource: ['Actors'],
	operation: ['Send Server Actor request'],
};

export const properties: INodeProperties[] = [
	{
		displayName: 'Actor Source',
		name: 'actorSource',
		type: 'hidden',
		default: 'recentlyUsed',
		displayOptions: { show },
	},
	{
		// Rewritten into the Actor resource locator by `overrideActorProperties`.
		displayName: 'Actor',
		name: 'actorId',
		required: true,
		description:
			'The Server Actor to send the request to, in the format "username~actor-name" or as a plain Actor ID',
		default: 'janedoe~my-actor',
		type: 'string',
		displayOptions: { show },
	},
	...serverActorProperties(show),
];
