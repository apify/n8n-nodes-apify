import { INodePropertyOptions } from 'n8n-workflow';

import * as helpers from '../../../helpers';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const scrapeSingleUrlName = 'Scrape single URL';

const rawOption: INodePropertyOptions = {
	name: scrapeSingleUrlName,
	value: scrapeSingleUrlName,
	action: scrapeSingleUrlName,
	description: 'Scrape a single URL using the Apify Website Content Crawler Actor',
	routing: {
		request: {
			method: 'POST',
			url: `=/v2/acts/${helpers.consts.WCC_ACTOR_ID}/run-sync-get-dataset-items`,
			body: {
				customBody: {
					maxCrawlDepth: 0,
					maxCrawlPages: 1,
					maxResults: 1,
					proxyConfiguration: {
						useApifyProxy: true,
					},
					removeCookieWarnings: true,
					saveHtml: true,
					saveMarkdown: true,
				},
			},
		},
		send: {
			preSend: [helpers.hooks.preSendActionCustonBody],
		},
	},
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
