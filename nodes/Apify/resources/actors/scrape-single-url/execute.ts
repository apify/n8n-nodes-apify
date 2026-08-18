import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { apiRequest, pollRunStatus } from '../../../resources/genericFunctions';
import { consts } from '../../../helpers';

export async function scrapeSingleUrl(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const url = this.getNodeParameter('url', i) as string;
	const crawlerType = this.getNodeParameter('crawlerType', i, 'cheerio') as string;
	const outputFormat = this.getNodeParameter('outputFormat', i, 'markdown') as string;

	const isValidHostname = (hostname: string): boolean =>
		/^(?=.{1,253}$)((?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}$/.test(hostname);
	try {
		const parsedUrl = new URL(url);
		if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
			throw new Error('Unsupported protocol');
		}
		if (!isValidHostname(parsedUrl.hostname)) {
			throw new Error('Invalid hostname');
		}
	} catch {
		throw new NodeOperationError(
			this.getNode(),
			`Invalid URL: "${url}". Provide a full, valid URL including a domain name, e.g. https://example.com.`,
			{ itemIndex: i },
		);
	}

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
			saveHtml: outputFormat === 'html',
			saveMarkdown: outputFormat === 'markdown',
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
			timeout: consts.DATASET_REQUEST_TIMEOUT_MS,
		});

		if (!item) {
			throw new NodeApiError(this.getNode(), {
				message:
					'No content was scraped from the provided URL. Make sure the URL is valid and publicly accessible.',
			});
		}

		const content = { [outputFormat]: item[outputFormat] };

		// The scraper returns all content fields (text/html/markdown) regardless of the save
		// flags, so strip them from the metadata and keep only the selected format.
		const metadata = { ...item };
		delete metadata.text;
		delete metadata.html;
		delete metadata.markdown;

		return { json: { ...metadata, ...content } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
