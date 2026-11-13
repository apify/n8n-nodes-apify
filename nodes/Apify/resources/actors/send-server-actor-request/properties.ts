import { INodeProperties } from 'n8n-workflow';

import { HTTP_METHODS } from '../../../helpers/consts';

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
	{
		displayName: 'Method',
		name: 'endpointMethod',
		type: 'options',
		default: 'GET',
		options: HTTP_METHODS.map((method) => ({ name: method, value: method })),
		displayOptions: { show },
	},
	{
		displayName: 'Path',
		name: 'endpointPath',
		type: 'string',
		default: '/',
		placeholder: '/search',
		description: "Path on the Actor's server, starting with /",
		displayOptions: { show },
	},
	{
		displayName: 'Query Parameters',
		name: 'endpointQuery',
		type: 'json',
		default: '{}',
		description: 'Query parameters as a JSON object, e.g. {"limit": 10}',
		displayOptions: { show },
	},
	{
		displayName: 'Body',
		name: 'endpointBody',
		type: 'json',
		default: '{}',
		description: 'JSON request body',
		displayOptions: { show: { ...show, endpointMethod: ['POST', 'PUT', 'PATCH', 'DELETE'] } },
	},
];
