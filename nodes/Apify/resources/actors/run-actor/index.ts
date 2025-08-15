import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const name = 'Run actor';

const rawOption: INodePropertyOptions = {
	name: 'Run an Actor',
	value: 'Run actor',
	action: 'Run an Actor',
	description:
		'Runs an Actor. You can override the Actor’s input configuration by providing a custom body, which will override the prefilled input values.',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
