import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { properties } from './Apify.properties';
import { methods } from './Apify.methods';
import { getKeyValueStoreRecord } from './resources/key-value-stores/get-key-value-store-record/execute';

export class Apify implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Apify',
		name: 'apify',
		icon: 'file:apify.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'The Apify integration for n8n empowers you to automate web scraping, data extraction, and workflow orchestration by connecting Apify Actors directly to your n8n workflows. This integration is especially valuable for AI and large language model (LLM) use cases, enabling you to collect, process, and deliver high-quality, up-to-date data for generative AI, chatbots.',
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

		requestDefaults: {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			baseURL: 'https://api.apify.com',
		},

		properties,
	};

	methods = methods;

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			// refactor to use switch if more execute functions are added
			if (resource === 'Key-Value Stores' && operation === 'Get Key-Value Store Record') {
				returnData.push(await getKeyValueStoreRecord.call(this, i));
			}
		}

		return [returnData];
	}
}
