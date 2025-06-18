import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

const name = 'Get Run';

const rawOption: INodePropertyOptions = {
	name: name,
	value: name,
	action: name,
	description:
		'This is not a single endpoint but an entire group of endpoints that lets you retrieve the run or any of its default storages. The endpoints accept the same HTTP methods and query parameters as the respective storage endpoints.',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties, name };
