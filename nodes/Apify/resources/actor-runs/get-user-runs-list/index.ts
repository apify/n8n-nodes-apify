import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const name = 'Get user runs list';

const rawOption: INodePropertyOptions = {
	name: 'Get User Runs List',
	value: 'Get user runs list',
	action: 'Get user runs list',
	description:
		'Gets a list of Actor runs for the user. This endpoint is useful for retrieving a history of runs, their statuses, and other data.',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
