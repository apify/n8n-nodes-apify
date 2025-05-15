import { INodePropertyOptions } from 'n8n-workflow';

// @ts-ignore
import * as helpers from '../../../helpers';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const name = 'Get Key-value Store Record';

const rawOption: INodePropertyOptions = {
	name: 'Get Key-value Store Record',
	value: 'Get Key-value Store Record',
	action: 'Get Key-value Store Record',
	description: 'Gets a value stored in the key-value store under a specific key.',
	routing: {
		request: {
			method: 'GET',
			url: '=/v2/key-value-stores/{{$parameter["storeId"]}}/records/{{$parameter["recordKey"]}}',
		},
	},
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
