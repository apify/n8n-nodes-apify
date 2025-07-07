import { INodeProperties, ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { apiRequestAllItems } from './genericFunctions';

const resourceLocatorProperty: INodeProperties = {
	displayName: 'Actor',
	name: 'actorId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	modes: [
		{
			displayName: 'From list',
			name: 'list',
			type: 'list',
			placeholder: 'Choose...',
			typeOptions: {
				searchListMethod: 'listActors',
				searchFilterRequired: false,
				searchable: true,
			},
		},
		{
			displayName: 'By URL',
			name: 'url',
			type: 'string',
			placeholder: 'https://console.apify.com/actors/AtBpiepuIUNs2k2ku/input',
			validation: [
				{
					type: 'regex',
					properties: {
						// https://console.apify.com/actors/AtBpiepuIUNs2k2ku/input
						// https://console.apify.com/actors/AtBpiepuIUNs2k2ku
						regex: 'https://console.apify.com/actors/([a-zA-Z0-9]+).*',
						errorMessage: 'Not a valid Actor URL',
					},
				},
			],
			extractValue: {
				type: 'regex',
				// https://console.apify.com/actors/AtBpiepuIUNs2k2ku/input -> AtBpiepuIUNs2k2ku
				// https://console.apify.com/actors/AtBpiepuIUNs2k2ku -> AtBpiepuIUNs2k2ku
				regex: `https://console.apify.com/actors/([a-zA-Z0-9]+).*`,
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

const actorSourceProperty: INodeProperties = {
	displayName: 'Actor Source',
	name: 'actorSource',
	type: 'options',
	options: [
		{
			name: 'Recently Used Actors',
			value: 'recentlyUsed',
		},
		{
			name: 'Apify Store Actors',
			value: 'store',
		},
	],
	default: 'recentlyUsed',
	description: 'Choose whether to select from your recently used Actors or browse Apify Store',
	displayOptions: { show: { resource: ['actor'] } },
};

function mapProperty(property: INodeProperties): INodeProperties {
	return {
		...property,
		...resourceLocatorProperty,
	};
}

function createActorSourceProperty(displayOptions: any): INodeProperties {
	return {
		...actorSourceProperty,
		displayOptions,
	};
}

export function overrideActorProperties(properties: INodeProperties[]): INodeProperties[] {
	const result: INodeProperties[] = [];

	for (const property of properties) {
		if (property.name === 'actorId') {
			result.push(createActorSourceProperty(property.displayOptions));
			result.push(mapProperty(property));
		} else {
			result.push(property);
		}
	}

	return result;
}

export async function listActors(
	this: ILoadOptionsFunctions,
	searchTerm?: string,
): Promise<INodeListSearchResult> {
	const actorSource = this.getNodeParameter('actorSource', 'recentlyUsed') as string;

	const mapToN8nResult = (actor: any) => ({
		name: actor.title || actor.name,
		value: actor.id,
		url: `https://console.apify.com/actors/${actor.id}/input`,
		description: actor.description || actor.name,
	});

	const {
		data: { items: recentActors },
	} = await apiRequestAllItems.call(this, {
		method: 'GET',
		uri: '/v2/acts',
		qs: {
			limit: 1000,
			offset: 0,
		},
	});

	if (actorSource === 'recentlyUsed') {
		if (searchTerm) {
			const regex = new RegExp(searchTerm, 'i');
			const filteredActors = recentActors.filter(
				(actor: any) => regex.test(actor.title || '') || regex.test(actor.name || ''),
			);
			return {
				results: filteredActors.map(mapToN8nResult),
			};
		}
		return {
			results: recentActors.map(mapToN8nResult),
		};
	}

	const {
		data: { items: storeActors },
	} = await apiRequestAllItems.call(this, {
		method: 'GET',
		uri: '/v2/store',
		qs: {
			limit: 200,
			offset: 0,
			search: searchTerm,
		},
	});

	const recentIds = recentActors.map((actor: any) => actor.id);
	const filtered = storeActors.filter((actor: any) => !recentIds.includes(actor.id));

	return {
		results: filtered.map(mapToN8nResult),
	};
}
