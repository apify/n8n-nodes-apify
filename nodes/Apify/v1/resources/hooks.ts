import { INodeProperties, INodeType } from 'n8n-workflow';

import { overrideActorProperties, listActors } from './actorResourceLocator';
import { overrideActorTaskProperties, listActorTasks } from './actorTaskResourceLocator';
import { overrideRunProperties, listRuns } from './runResourceLocator';
import {
	listKeyValueStores,
	overrideKeyValueStoreProperties,
} from './keyValueStoreResourceLocator';
import {
	listKeyValueStoreRecordKeys,
	overrideKeyValueStoreRecordKeyProperties,
} from './keyValueStoreRecordKeyResourceLocator';

function compose(...fns: Function[]) {
	return (x: any) => fns.reduce((v, f) => f(v), x);
}

export function runHooks(properties: INodeProperties[]): {
	properties: INodeProperties[];
	methods: INodeType['methods'];
} {
	const processProperties = compose(
		overrideActorProperties,
		overrideActorTaskProperties,
		overrideRunProperties,
		overrideKeyValueStoreProperties,
		overrideKeyValueStoreRecordKeyProperties,
	);

	return {
		properties: processProperties(properties),
		methods: {
			listSearch: {
				listActors,
				listActorTasks,
				listRuns,
				listKeyValueStores,
				listKeyValueStoreRecordKeys,
			},
		},
	};
}
