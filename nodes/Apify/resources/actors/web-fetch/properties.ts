import { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		description: 'URL to be fetched. Must start with http:// or https:// and be a valid URL.',
		default: 'https://docs.apify.com/academy/web-scraping-for-beginners',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Web Fetch'],
			},
		},
	},
	{
		displayName: 'Formats',
		name: 'formats',
		type: 'multiOptions',
		default: ['markdown'],
		description:
			'Which content formats to return. Only the selected formats are returned. Markdown is recommended for AI agents and LLMs.',
		options: [
			{
				name: 'HTML',
				value: 'html',
				description: 'Raw HTML - best for programmatic processing',
			},
			{
				name: 'Links',
				value: 'links',
				description: 'Deduplicated list of links found on the page - useful for crawl queues',
			},
			{
				name: 'Markdown',
				value: 'markdown',
				description: 'Clean markdown - best for AI agents and LLMs',
			},
			{
				name: 'Raw',
				value: 'raw',
				description: 'Original raw body - base64-encoded for binary content',
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
				operation: ['Web Fetch'],
			},
		},
	},
	{
		displayName: 'Headers',
		name: 'headers',
		type: 'json',
		default: '{}',
		description:
			'Optional custom headers to send to the target URL, as an object of header names and values, e.g. {"Accept-Language": "fr-FR"}. Leave as {} to send none.',
		displayOptions: {
			show: {
				resource: ['Actors'],
				operation: ['Web Fetch'],
			},
		},
	},
];
