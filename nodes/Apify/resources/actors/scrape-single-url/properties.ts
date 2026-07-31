import { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		description: 'URL to be scraped. Must start with http:// or https:// and be a valid URL.',
		default: 'https://docs.apify.com/academy/web-scraping-for-beginners',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Scrape single URL'],
			},
		},
	},
	{
		displayName: 'Crawler Type',
		name: 'crawlerType',
		default: 'cheerio',
		type: 'options',
		options: [
			{
				name: 'Cheerio',
				value: 'cheerio',
			},
			{
				name: 'JSDOM',
				value: 'jsdom',
			},
			{
				name: 'Playwright Adaptive',
				value: 'playwright:adaptive',
			},
			{
				name: 'Playwright Firefox',
				value: 'playwright:firefox',
			},
		],
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Scrape single URL'],
			},
		},
	},
	{
		displayName: 'Output Format',
		name: 'outputFormat',
		type: 'options',
		default: 'markdown',
		description: 'Which content format to return. Markdown is recommended for AI agents and LLMs.',
		options: [
			{
				name: 'Markdown',
				value: 'markdown',
				description: 'Clean markdown - best for AI agents and LLMs',
			},
			{
				name: 'HTML',
				value: 'html',
				description: 'Raw HTML - best for programmatic processing',
			},
			{
				name: 'Text',
				value: 'text',
				description: 'Plain text with no formatting',
			},
		],
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Scrape single URL'],
			},
		},
	},
	{
		displayName: 'Include Metadata',
		name: 'includeMetadata',
		type: 'boolean',
		default: false,
		description:
			'Whether to include page metadata (URL, crawl details, page metadata) alongside the content. Leave off for lean output best suited to AI agents; turn on when you need the full page context.',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Scrape single URL'],
			},
		},
	},
];
