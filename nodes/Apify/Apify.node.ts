/* eslint-disable n8n-nodes-base/node-class-description-outputs-wrong */
/* eslint-disable n8n-nodes-base/node-class-description-inputs-wrong-regular-node */

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import { properties } from './Apify.properties';
import { methods } from './Apify.methods';
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
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
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
		return await executeAndLinkItems.call(this, async function(this: IExecuteFunctions) {
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

			return returnData;
		})
	}
}
