import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const name = 'Get last run';

const rawOption: INodePropertyOptions = {
	name: 'Get Last Run',
	value: 'Get last run',
	action: 'Get last run',
	description:
		'This is not a single endpoint but an entire group of endpoints that lets you to retrieve and manage the last run of given Actor or any of its default storages',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
