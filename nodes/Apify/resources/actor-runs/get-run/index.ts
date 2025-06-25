import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

const name = 'Get run';

const rawOption: INodePropertyOptions = {
	name: name,
	value: name,
	action: name,
	description:
		'Gets the details of a specific Actor run by its ID. This endpoint is useful for retrieving information about a run, such as its status, storages, and other metadata.',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties, name };
