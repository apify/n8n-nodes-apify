import { IExecuteFunctions, INodeExecutionData, NodeApiError } from 'n8n-workflow';
import { apiRequest } from '../../../resources/genericFunctions';
import { consts } from '../../../helpers';

export async function scrapeSingleUrl(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	console.debug('[scrapeSingleUrl] Start');
	const url = this.getNodeParameter('url', i) as string;
	console.debug('[scrapeSingleUrl] url:', url);
	const crawlerType = this.getNodeParameter('crawlerType', i, 'cheerio') as string;
	console.debug('[scrapeSingleUrl] crawlerType:', crawlerType);

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
		console.debug('[scrapeSingleUrl] input:', input);

		// Run the actor and do not wait for finish
		console.debug('[scrapeSingleUrl] Running actor with waitForFinish: 0');
		const run = await apiRequest.call(this, {
			method: 'POST',
			uri: `/v2/acts/${consts.WEB_CONTENT_SCRAPER_ACTOR_ID}/runs`,
			body: input,
			qs: { waitForFinish: 0 },
		});
		console.debug('[scrapeSingleUrl] Actor run response:', run);

		const runId = run?.data?.id || run?.id;
		console.debug('[scrapeSingleUrl] runId:', runId);
		if (!runId) {
			console.debug('[scrapeSingleUrl] No run ID returned from actor run');
			throw new NodeApiError(this.getNode(), {
				message: 'No run ID returned from actor run',
			});
		}

		// Poll for terminal status
		let lastRunData = run.data || run;
		while (true) {
			try {
				console.debug(`[scrapeSingleUrl] Polling for runId:`, runId);
				const pollResult = await apiRequest.call(this, {
					method: 'GET',
					uri: `/v2/actor-runs/${runId}`,
				});
				const status = pollResult?.data?.status;
				console.debug(`[scrapeSingleUrl] Poll status:`, status);
				lastRunData = pollResult?.data;
				if (consts.TERMINAL_RUN_STATUSES.includes(status)) {
					console.debug('[scrapeSingleUrl] Terminal status reached:', status);
					break;
				}
			} catch (err) {
				console.debug('[scrapeSingleUrl] Error polling run status:', err);
				throw new NodeApiError(this.getNode(), {
					message: `Error polling run status: ${err}`,
				});
			}
			await new Promise((resolve) => setTimeout(resolve, consts.WAIT_FOR_FINISH_POLL_INTERVAL));
		}

		const defaultDatasetId = lastRunData?.defaultDatasetId;
		console.debug('[scrapeSingleUrl] defaultDatasetId:', defaultDatasetId);

		if (!defaultDatasetId) {
			console.debug('[scrapeSingleUrl] No dataset ID returned from actor run');
			throw new NodeApiError(this.getNode(), {
				message: 'No dataset ID returned from actor run',
			});
		}

		console.debug('[scrapeSingleUrl] Fetching dataset items for datasetId:', defaultDatasetId);
		const [item] = await apiRequest.call(this, {
			method: 'GET',
			uri: `/v2/datasets/${defaultDatasetId}/items`,
			qs: { format: 'json' },
		});
		console.debug('[scrapeSingleUrl] First dataset item:', item);

		return { json: { ...item } };
	} catch (error) {
		console.debug('[scrapeSingleUrl] Error:', error);
		throw new NodeApiError(this.getNode(), error);
	}
}
