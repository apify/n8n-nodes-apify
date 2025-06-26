import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const name = 'Get items';

const rawOption: INodePropertyOptions = {
	name: 'Get Items',
	value: 'Get items',
	action: 'Get dataset items',
	description: 'Retrieves items from a dataset',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
