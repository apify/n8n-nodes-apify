import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { properties } from './Apify.properties';
import { methods } from './Apify.methods';
import { resourceRouter } from './resources/router';

export class Apify implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Apify',
		name: 'apify',
		icon: 'file:apify.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'The Apify integration for n8n lets you automate web scraping, data extraction, and workflow orchestration by connecting Apify Actors directly to your n8n workflows. This integration is especially valuable for AI and large language model (LLM) use cases. Collect, process, and deliver high-quality, up-to-date data for generative AI and chatbots.',
		defaults: {
			name: 'Apify',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				displayName: 'Apify API key connection',
				name: 'apifyApi',
				required: false,
				displayOptions: {
					show: {
						authentication: ['apifyApi'],
					},
				},
			},
			{
				displayName: 'Apify OAuth2 connection',
				name: 'apifyOAuth2Api',
				required: false,
				displayOptions: {
					show: {
						authentication: ['apifyOAuth2Api'],
					},
				},
			},
		],

		properties,
	};

	methods = methods;

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const data = await resourceRouter.call(this, i);
			// `data` may be an array of items or a single item, so we either push the spreaded array or the single item
			if (Array.isArray(data)) {
				returnData.push(...data);
			} else {
				returnData.push(data);
			}
		}

		return [returnData];
	}
}
