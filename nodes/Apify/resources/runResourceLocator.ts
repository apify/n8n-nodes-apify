import { INodeProperties, ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { apiRequestAllItems } from './genericFunctions';

const resourceLocatorProperty: INodeProperties = {
	displayName: 'Run ID',
	name: 'runId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	modes: [
		{
			displayName: 'From list',
			name: 'list',
			type: 'list',
			placeholder: 'Choose...',
			typeOptions: {
				searchListMethod: 'listRuns',
				searchFilterRequired: false,
				searchable: false,
			},
		},
		{
			displayName: 'By URL',
			name: 'url',
			type: 'string',
			placeholder: 'https://console.apify.com/actors/runs/RDfcScrqIYHW0jfNF#output',
			validation: [
				{
					type: 'regex',
					properties: {
						// https://console.apify.com/actors/runs/RDfcScrqIYHW0jfNF#output
						regex: 'https://console.apify.com/actors(/[a-zA-Z0-9]+)?/runs/([a-zA-Z0-9]+).*',
						errorMessage: 'Not a valid Apify Actor Run URL',
					},
				},
			],
			extractValue: {
				type: 'regex',
				// https://console.apify.com/actors/runs/RDfcScrqIYHW0jfNF#output -> RDfcScrqIYHW0jfNF
				regex: 'https://console.apify.com/actors(?:/[a-zA-Z0-9]+)?/runs/([a-zA-Z0-9]+).*',
			},
		},
		{
			displayName: 'ID',
			name: 'id',
			type: 'string',
			validation: [
				{
					type: 'regex',
					properties: {
						regex: '[a-zA-Z0-9]+',
						errorMessage: 'Not a valid Apify Actor run ID',
					},
				},
			],
			placeholder: 'WAtmhr6rhfBnwqKDY',
			url: '=http:/console.apify.com/actors/{{ $value }}/runs/{{ $value }}#log',
		},
	],
};

function mapProperty(property: INodeProperties) {
	return {
		...property,
		...resourceLocatorProperty,
	};
}
export function overrideRunProperties(properties: INodeProperties[]) {
	return properties.map((property) => {
		if (property.name === 'runId') {
			return mapProperty(property);
		}
		return property;
	});
}

export async function listRuns(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
	const searchResults = await apiRequestAllItems.call(this, {
		method: 'GET',
		uri: '/v2/actor-runs',
		qs: {
			limit: 100,
			offset: 0,
			desc: 1,
		},
	});

	const { data } = searchResults;
	const { items } = data;

	return {
		results: items.map((b: any) => {
			const url = `https://console.apify.com/runs/${b.id}`;

			const readableDateTime = b.finishedAt
				? `${new Date(b.finishedAt).toDateString()} ${new Date(b.finishedAt).toLocaleTimeString()}`
				: undefined;

			return {
				name: [readableDateTime, b.status].filter(Boolean).join(' - '),
				value: b.id,
				url,
				description: b.status,
			};
		}),
	};
}
