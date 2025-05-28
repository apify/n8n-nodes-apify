/* eslint-disable n8n-nodes-base/node-filename-against-convention */
/* eslint-disable n8n-nodes-base/node-class-description-inputs-wrong-regular-node */
/* eslint-disable n8n-nodes-base/node-class-description-outputs-wrong */

import {
	// IExecuteFunctions,
	INodeType,
	INodeTypeBaseDescription,
	INodeTypeDescription,
} from 'n8n-workflow';
import { properties } from './Apify.properties';
import { methods } from './Apify.methods';

const versionDescription: INodeTypeDescription = {
	displayName: 'Apify',
	name: 'apify',
	group: ['transform'],
	version: 1,
	description: 'Apify API',
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

export class ApifyV1 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			...versionDescription,
		};
	}

	methods = methods;
}
