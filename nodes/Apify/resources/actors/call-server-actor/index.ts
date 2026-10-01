import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const name = 'Call Server Actor';

const rawOption: INodePropertyOptions = {
	name: 'Call Server Actor',
	value: name,
	action: 'Call a Server Actor',
	description:
		'Send an HTTP request to an Actor with the server interface enabled and get its response straight back, without starting a run',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
