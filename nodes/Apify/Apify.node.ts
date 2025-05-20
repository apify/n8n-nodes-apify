import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { properties } from './Apify.properties';
import { methods } from './Apify.methods';

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
				displayName: 'Apify connection',
				name: 'apifyApi',
				required: false,
				displayOptions: {
					show: {
						authentication: ['apifyApi'],
					},
				},
			},
			{
				displayName: 'Apify OAuth2 API',
				name: 'apifyOAuth2Api',
				required: false,
				displayOptions: {
					show: {
						authentication: ['apifyOAuth2Api'],
					},
				},
			},
		],

		requestDefaults: {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'x-apify-integration-platform': 'n8n',
			},
			baseURL: 'https://api.apify.com',
		},

		properties,
	};

	methods = methods;
}
