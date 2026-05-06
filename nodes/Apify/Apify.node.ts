 
 

import {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType
} from 'n8n-workflow';
import { properties } from './Apify.properties';
import { methods } from './resources';
import { resourceRouter } from './resources/router';
import { executeAndLinkItems } from './resources/genericFunctions';

export class Apify implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Apify',
		name: 'apify',
		icon: 'file:apify.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Access Apify tools for web scraping, data extraction, and automation.',
		defaults: {
			name: 'Apify',
		},
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		usableAsTool: true,
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
		return await executeAndLinkItems.call(this, async function (this: IExecuteFunctions, itemIndex: number) {
			return await resourceRouter.call(this, itemIndex);
		});
	}
}
