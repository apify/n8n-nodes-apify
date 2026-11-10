import { INodeProperties } from 'n8n-workflow';

import { serverActorLocatorProperty } from '../../actorResourceLocator';
import { serverActorProperties } from '../../serverActor';

const show = {
	resource: ['Actors'],
	operation: ['Send Server Actor request'],
};

export const properties: INodeProperties[] = [
	// Lists only Server Actors, so it replaces the shared Actor picker and its Actor source.
	serverActorLocatorProperty({ show }),
	...serverActorProperties(show),
];
