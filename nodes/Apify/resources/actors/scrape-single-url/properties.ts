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
];
