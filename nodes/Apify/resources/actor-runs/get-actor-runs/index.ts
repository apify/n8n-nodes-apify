import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const name = 'Get runs';

const rawOption: INodePropertyOptions = {
	name: name,
	value: name,
	action: name,
	description:
		'Gets a list of Actor runs. This endpoint is useful for retrieving a history of runs, their statuses, and other data.',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
