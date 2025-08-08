import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const name = 'Run actor and get dataset';

const rawOption: INodePropertyOptions = {
	name: 'Run an Actor and Get Dataset',
	value: 'Run actor and get dataset',
	action: 'Run an Actor and get dataset',
	description: 'Runs an Actor, waits for it to finish, and finally returns the dataset items',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
