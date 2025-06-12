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
	const actorSource = (this.getNodeParameter('actorSource', '') as string) || 'recentlyUsed';

	const response = await apiRequestAllItems.call(this, {
		method: 'GET',
		uri: '/v2/acts',
		qs: {
			limit: 200,
			offset: 0,
		},
	});

	const recentActors = response.data.items;
	if (actorSource === 'recentlyUsed') {
		return {
			results: recentActors.map((actor: any) => ({
				name: actor.title || actor.name,
				value: actor.id,
				url: `https://console.apify.com/actors/${actor.id}/input`,
				description: actor.description || actor.name,
			})),
		};
	}

	const storeResponse = await apiRequestAllItems.call(this, {
		method: 'GET',
		uri: '/v2/store',
		qs: {
			limit: 200,
			offset: 0,
		},
	});

	const recentIds = recentActors.map((actor: any) => actor.id);
	const filtered = storeResponse.data.items.filter((actor: any) => !recentIds.includes(actor.id));

	return {
		results: filtered.map((actor: any) => ({
			name: actor.title || actor.name,
			value: actor.id,
			url: `https://console.apify.com/actors/${actor.id}/input`,
			description: actor.description || actor.name,
		})),
	};
}
