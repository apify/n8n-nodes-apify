import { IExecuteFunctions, INodeExecutionData, NodeApiError } from 'n8n-workflow';
import { apiRequest, pollRunStatus } from '../../../resources/genericFunctions';
import { consts } from '../../../helpers';

export async function scrapeSingleUrl(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const url = this.getNodeParameter('url', i) as string;
	const crawlerType = this.getNodeParameter('crawlerType', i, 'cheerio') as string;

	try {
		const input = {
			startUrls: [{ url }],
			crawlerType,
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

		// Run the actor and do not wait for finish

		const run = await apiRequest.call(this, {
			method: 'POST',
			uri: `/v2/acts/${consts.WEB_CONTENT_SCRAPER_ACTOR_ID}/runs`,
			body: input,
			qs: { waitForFinish: 0 },
		});

		const runId = run?.data?.id || run?.id;

		if (!runId) {
			throw new NodeApiError(this.getNode(), {
				message: 'No run ID returned from actor run',
			});
		}

		// Poll for terminal status
		const lastRunData = await pollRunStatus.call(this, runId);

		const defaultDatasetId = lastRunData?.defaultDatasetId;

		if (!defaultDatasetId) {
			throw new NodeApiError(this.getNode(), {
				message: 'No dataset ID returned from actor run',
			});
		}

		const [item] = await apiRequest.call(this, {
			method: 'GET',
			uri: `/v2/datasets/${defaultDatasetId}/items`,
			qs: { format: 'json' },
		});

		return { json: { ...item } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
