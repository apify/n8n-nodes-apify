import { IExecuteFunctions, INodeExecutionData, NodeApiError } from 'n8n-workflow';
import { getAuthedApifyClient } from '../../../helpers/apify-client';
import { consts } from '../../../helpers';

export async function scrapeSingleUrl(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const url = this.getNodeParameter('url', i) as string;
	const crawlerType = this.getNodeParameter('crawlerType', i, 'cheerio') as string;

	const client = await getAuthedApifyClient.call(this);

	try {
		const input = {
			startUrls: [{ url }],
			crawlerType,

			// Default values for scrape single URL actor
			maxCrawlDepth: 0,
			maxCrawlPages: 1,
			maxResults: 1,
			proxyConfiguration: {
				useApifyProxy: true,
			},
			removeCookieWarnings: true,
			saveHtml: true,
			saveMarkdown: true,
		};

		// Run the actor and wait for it to finish
		const { defaultDatasetId } = await client
			.actor(consts.WEB_CONTENT_SCRAPER_ACTOR_ID)
			.call(input);

		if (!defaultDatasetId) {
			throw new NodeApiError(this.getNode(), {
				message: 'No dataset ID returned from actor run',
			});
		}

		const { items } = await client.dataset(defaultDatasetId).listItems();

		return { json: { items } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
