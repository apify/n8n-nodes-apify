import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const scrapeSingleUrlName = 'Scrape single URL';

const rawOption: INodePropertyOptions = {
	name: 'Scrape Single URL',
	value: scrapeSingleUrlName,
	action: scrapeSingleUrlName,
	description:
		'Scrape a single URL using the Apify Website Content Crawler Actor and get its content as text, markdown, and HTML',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
