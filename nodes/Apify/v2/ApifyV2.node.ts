/* eslint-disable n8n-nodes-base/node-filename-against-convention  */
/* eslint-disable n8n-nodes-base/node-class-description-inputs-wrong-regular-node */
/* eslint-disable n8n-nodes-base/node-class-description-outputs-wrong */

import {
	// IExecuteFunctions,
	// INodeExecutionData,
	INodeType,
	INodeTypeBaseDescription,
	INodeTypeDescription,
	// NodeConnectionType,
} from 'n8n-workflow';
import { properties } from './Apify.properties';
import { methods } from './Apify.methods';
// import { getKeyValueStoreRecord } from './resources/key-value-stores/get-key-value-store-record/execute';

// const versionDescription: INodeTypeDescription = {
// 	displayName: 'Apify',
// 	name: 'apify',
// 	group: ['transform'],
// 	version: 2,
// 	description: 'Apify API',
// 	defaults: {
// 		name: 'Apify',
// 	},
// 	inputs: ['main'],
// 	outputs: ['main'],
// 	credentials: [
// 		{
// 			displayName: 'Apify API',
// 			name: 'apifyApi',
// 			required: true,
// 		},
// 	],

// 	properties,
// };

export class ApifyV2 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			version: 2,
			defaults: {
				name: 'Apify',
			},
			inputs: ['main'],
			outputs: ['main'],
			credentials: [
				{
					displayName: 'Apify API',
					name: 'apifyApi',
					required: true,
				},
			],

			properties,
		};
	}

	methods = methods;

	// async execute(this: IExecuteFunctions) {
	// 	const items = this.getInputData();
	// 	const returnData: INodeExecutionData[] = [];

	// 	const resource = this.getNodeParameter('resource', 0);
	// 	const operation = this.getNodeParameter('operation', 0);

	// 	for (let i = 0; i < items.length; i++) {
	// 		// refactor to use switch if more execute functions are added
	// 		if (resource === 'Key-Value Stores' && operation === 'Get Key-Value Store Record') {
	// 			returnData.push(await getKeyValueStoreRecord.call(this, i));
	// 		}
	// 	}

	// 	return [returnData];
	// }
}
