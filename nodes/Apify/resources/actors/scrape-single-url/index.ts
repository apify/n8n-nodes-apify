import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const scrapeSingleUrlName = 'Scrape single URL';

const rawOption: INodePropertyOptions = {
	name: '(Deprecated) Scrape Single URL',
	value: scrapeSingleUrlName,
	action: scrapeSingleUrlName,
	description:
		'This operation is deprecated and will be removed in a future release. Use the Web Fetch operation instead.',
	displayOptions: {
		show: {
			'@version': [1],
		},
	},
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
