import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

const name = 'Get Key-Value Store Record';

const rawOption: INodePropertyOptions = {
	name: name,
	value: name,
	action: 'Get key-value store record',
	description: 'Gets a value stored in the key-value store under a specific key',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties, name };
