import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const name = 'Run task';

const rawOption: INodePropertyOptions = {
	name: 'Run Task',
	value: 'Run task',
	action: 'Run task',
	description:
		'Runs an Actor Task and return all associated details. You can optionally override the Actor’s input configuration by providing a custom body.',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
