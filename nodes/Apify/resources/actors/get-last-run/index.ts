import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const name = 'Get last run';

const rawOption: INodePropertyOptions = {
	name: 'Get Last Run',
	value: 'Get last run',
	action: 'Get last run',
	description:
		'Retrieves the most recent run of an Actor. This endpoint is useful for quickly accessing the latest run details, including its status and storages, without needing to specify a run ID.',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
