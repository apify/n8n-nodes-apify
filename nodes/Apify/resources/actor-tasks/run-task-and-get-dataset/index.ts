import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const name = 'Run task and get dataset';

const rawOption: INodePropertyOptions = {
	name: 'Run Task and Get Dataset',
	value: 'Run task and get dataset',
	action: 'Run task and get dataset',
	description:
		'Runs an Actor task, waits for it to finish, and finally returns the dataset items. You can optionally override the Actor’s input configuration by providing a custom body.',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
