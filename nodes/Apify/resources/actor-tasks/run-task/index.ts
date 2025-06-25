import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const name = 'Run task';

const rawOption: INodePropertyOptions = {
	name: 'Run Task',
	value: 'Run task',
	action: 'Run task',
	description:
		"Runs an Actor task and immediately returns without waiting for the run to complete. You can optionally override the Actor's input configuration by passing a Custom Body.",
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
