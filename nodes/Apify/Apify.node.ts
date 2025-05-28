import { INodeTypeBaseDescription, IVersionedNodeType, VersionedNodeType } from 'n8n-workflow';
import { ApifyV1 } from './v1/ApifyV1.node';
// import { ApifyV2 } from './v2/ApifyV2.node';

export class Apify extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Apify',
			name: 'apify',
			icon: 'file:apify.svg',
			group: ['transform'],
			description:
				'The Apify integration for n8n empowers you to automate web scraping, data extraction, and workflow orchestration by connecting Apify Actors directly to your n8n workflows. This integration is especially valuable for AI and large language model (LLM) use cases, enabling you to collect, process, and deliver high-quality, up-to-date data for generative AI, chatbots.',
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			defaultVersion: 1,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new ApifyV1(baseDescription),
			2: new ApifyV1(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
