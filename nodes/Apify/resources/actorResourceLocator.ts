import { INodeProperties, ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { apiRequestAllItems } from './genericFunctions';

const resourceLocatorProperty: INodeProperties = {
	displayName: 'Actor',
	name: 'actorId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			placeholder: 'Choose...',
			typeOptions: {
				searchListMethod: 'listActors',
				searchFilterRequired: false,
				searchable: false,
			},
		},
		// {
		// 	displayName: 'From Store',
		// 	name: 'store',
		// 	type: 'list',
		// 	placeholder: 'Choose from Apify Store...',
		// 	typeOptions: {
		// 		searchListMethod: 'listStoreActors',
		// 		searchFilterRequired: false,
		// 		searchable: false,
		// 	},
		// },
		{
			displayName: 'By URL',
			name: 'url',
			type: 'string',
			// https://console.apify.com/actors/AtBpiepuIUNs2k2ku/input
			placeholder: 'https://console.apify.com/actors/AtBpiepuIUNs2k2ku/input',
			validation: [
				{
					type: 'regex',
					properties: {
						// https://console.apify.com/actors/AtBpiepuIUNs2k2ku/input
						regex: 'https://console.apify.com/actors/([a-zA-Z0-9]+)',
						errorMessage: 'Not a valid Actor URL',
					},
				},
			],
			extractValue: {
				type: 'regex',
				// https://console.apify.com/actors/AtBpiepuIUNs2k2ku/input -> AtBpiepuIUNs2k2ku
				regex: 'https://console.apify.com/actors/([a-zA-Z0-9]+)',
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
						errorMessage: 'Not a valid Actor ID',
					},
				},
			],
			placeholder: 'NVCnbrChXaPbhVs8bISltEhngFg',
			url: '=http:/console.apify.com/actors/{{ $value }}/input',
		},
	],
};

function mapProperty(property: INodeProperties) {
	return {
		...property,
		...resourceLocatorProperty,
	};
}
export function overrideActorProperties(properties: INodeProperties[]) {
	return properties.map((property) => {
		if (property.name === 'actorId') {
			return mapProperty(property);
		}
		return property;
	});
}

export async function listActors(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
	const searchResults = await apiRequestAllItems.call(this, {
		method: 'GET',
		uri: '/v2/acts',
		qs: {
			limit: 100,
			offset: 0,
		},
	});

	const { data } = searchResults;
	const { items } = data;

	return {
		results: items.map((b: any) => ({
			name: b.title || b.name,
			value: b.id,
			url: `https://console.apify.com/actors/${b.id}/input`,
			description: b.name,
		})),
	};
}

// export async function listStoreActors(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
// 	const client = await getAuthedApifyClient.call(this);
// 	const { items } = await client.store().list({ limit: 50 });

// 	return {
// 		results: items.map((b: any) => ({
// 			name: b.title || b.name,
// 			value: b.id,
// 			url: `https://console.apify.com/actors/${b.id}/input`,
// 			description: b.description || b.name,
// 		})),
// 	};
// }
