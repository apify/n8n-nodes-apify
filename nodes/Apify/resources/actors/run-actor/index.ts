import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const name = 'Run actor';

const rawOption: INodePropertyOptions = {
	name: 'Run an Actor',
	value: 'Run actor',
	action: 'Run an Actor',
	description:
		'Runs an Actor with input from a JSON object or from fields loaded from the Actor’s input schema',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
