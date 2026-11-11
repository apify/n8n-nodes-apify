import { INodeProperties } from 'n8n-workflow';

import { HTTP_METHODS } from '../../../helpers/consts';
import {
	CUSTOM_ENDPOINT,
	MCP_ONLY,
	NO_ACTOR_SELECTED,
	NO_SERVER_INTERFACE,
} from '../../serverActor';

const show = {
	resource: ['Actors'],
	operation: ['Send Server Actor request'],
};
// Endpoint values that only carry a message: no request fields for them.
const placeholders = ['', NO_ACTOR_SELECTED, NO_SERVER_INTERFACE, MCP_ONLY];

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
		displayName: 'Endpoint Name or ID',
		name: 'endpoint',
		type: 'options',
		required: true,
		default: '',
		description:
			'The endpoint to send the request to, from the Actor\'s OpenAPI definition. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'listServerActorEndpoints',
			loadOptionsDependsOn: ['actorId.value'],
		},
		displayOptions: { show },
	},
	{
		displayName: 'Method',
		name: 'endpointMethod',
		type: 'options',
		default: 'GET',
		options: HTTP_METHODS.map((method) => ({ name: method, value: method })),
		displayOptions: { show: { ...show, endpoint: [CUSTOM_ENDPOINT] } },
	},
	{
		displayName: 'Path',
		name: 'endpointPath',
		type: 'string',
		default: '/',
		placeholder: '/search',
		description: "Path on the Actor's server, starting with /",
		displayOptions: { show: { ...show, endpoint: [CUSTOM_ENDPOINT] } },
	},
	{
		displayName: 'Query Parameters',
		name: 'endpointQuery',
		type: 'json',
		default: '{}',
		description:
			'Query parameters as a JSON object, e.g. {"limit": 10}. Values for path parameters such as {itemId} go here too.',
		displayOptions: { show, hide: { endpoint: placeholders } },
	},
	// Two Body properties, because the editor can't express "Custom Path with a method that takes
	// a body, or a documented endpoint other than GET" in one rule. Only one is shown.
	{
		displayName: 'Body',
		name: 'endpointBody',
		type: 'json',
		default: '{}',
		description: 'JSON request body',
		displayOptions: {
			show: {
				...show,
				endpoint: [CUSTOM_ENDPOINT],
				endpointMethod: ['POST', 'PUT', 'PATCH', 'DELETE'],
			},
		},
	},
	{
		displayName: 'Body',
		name: 'endpointBody',
		type: 'json',
		default: '{}',
		description: 'JSON request body',
		displayOptions: {
			show,
			hide: { endpoint: [...placeholders, CUSTOM_ENDPOINT, { _cnd: { startsWith: 'GET ' } }] },
		},
	},
];
