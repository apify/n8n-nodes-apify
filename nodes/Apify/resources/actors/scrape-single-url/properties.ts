import { INodeProperties } from 'n8n-workflow';

import * as helpers from '../../../helpers';

export const properties: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		description: 'URL to be scraped',
		default: 'https://docs.apify.com/academy/web-scraping-for-beginners',
		type: 'string',
		routing: {
			request: {
				body: {
					customBody: {
						startUrls: [{ url: '={{ $value }}' }],
					},
				},
			},
			send: {
				preSend: [helpers.hooks.preSendActionCustonBody],
			},
		},
		displayOptions: {
			show: {
				useCustomBody: [false],
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
		routing: {
			request: {
				body: {
					customBody: {
						crawlerType: '={{ $value }}',
					},
				},
			},
			send: {
				preSend: [helpers.hooks.preSendActionCustonBody],
			},
		},
		displayOptions: {
			show: {
				useCustomBody: [false],
				resource: ['Actors'],
				operation: ['Scrape single URL'],
			},
		},
	},
];
