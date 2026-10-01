import { INodeProperties, INodeType } from 'n8n-workflow';

import { listServerActorEndpoints } from '../serverActor';

export function runHooks(properties: INodeProperties[]): {
	properties: INodeProperties[];
	methods: INodeType['methods'];
} {
	return {
		properties,
		methods: {
			loadOptions: { listServerActorEndpoints },
		},
	};
}
