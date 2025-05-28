import { INodeProperties, INodeType } from 'n8n-workflow';

import {
	listKeyValueStores,
	overrideKeyValueStoreProperties,
} from './locators/keyValueStoreResourceLocator';
import {
	listKeyValueStoreRecordKeys,
	overrideKeyValueStoreRecordKeyProperties,
} from './locators/keyValueStoreRecordKeyResourceLocator';

function compose(...fns: Function[]) {
	return (x: any) => fns.reduce((v, f) => f(v), x);
}

export function runHooks(properties: INodeProperties[]): {
	properties: INodeProperties[];
	methods: INodeType['methods'];
} {
	const processProperties = compose(
		overrideKeyValueStoreProperties,
		overrideKeyValueStoreRecordKeyProperties,
	);

	return {
		properties: processProperties(properties),
		methods: {
			listSearch: {
				listKeyValueStores,
				listKeyValueStoreRecordKeys,
			},
		},
	};
}
