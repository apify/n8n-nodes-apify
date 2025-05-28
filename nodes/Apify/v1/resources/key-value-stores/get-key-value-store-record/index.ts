import { INodePropertyOptions } from 'n8n-workflow';

// @ts-ignore
import * as helpers from '../../../helpers';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const name = 'Get Key-Value Store Record';

const rawOption: INodePropertyOptions = {
	name: name,
	value: name,
	action: name,
	description: 'Gets a value stored in the key-value store under a specific key',
	routing: {
		request: {
			method: 'GET',
			url: '=/v2/key-value-stores/{{$parameter["storeId"]}}/records/{{$parameter["recordKey"]}}',
		},
	},
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
