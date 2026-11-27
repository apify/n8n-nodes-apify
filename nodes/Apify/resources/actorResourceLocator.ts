import { INodeProperties, ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { APIFY_CONSOLE_URL, SERVER_ACTOR_STORE_CATEGORIES } from '../helpers/consts';
import { apiRequest, apiRequestAllItems } from './genericFunctions';

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
			url: `=${APIFY_CONSOLE_URL}/actors/{{$value}}/input`,
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

/**
 * The Actor locator for Send Server Actor request: the same URL and ID modes, but the list
 * holds only Server Actors, so there is no Actor source select next to it.
 */
export function serverActorLocatorProperty(
	displayOptions: INodeProperties['displayOptions'],
): INodeProperties {
	return {
		...resourceLocatorProperty,
		description: 'The Server Actor to send the request to',
		required: true,
		modes: resourceLocatorProperty.modes!.map((mode) =>
			mode.name === 'list'
				? {
						...mode,
						placeholder: 'Choose a Server Actor...',
						typeOptions: { ...mode.typeOptions, searchListMethod: 'listServerActors' },
					}
				: mode,
		),
		displayOptions,
	};
}

export function overrideActorProperties(properties: INodeProperties[]): INodeProperties[] {
	const result: INodeProperties[] = [];

	for (const property of properties) {
		// Operations that bring their own locator (e.g. Server Actors) keep it.
		if (property.name === 'actorId' && property.type !== 'resourceLocator') {
			result.push(createActorSourceProperty(property.displayOptions));
			result.push(mapProperty(property));
		} else {
			result.push(property);
		}
	}

	return result;
}

const mapToN8nSelectOption = (actor: any) => {
	const optionName = actor.title
		? `${actor.title} (${actor.username}/${actor.name})`
		: `${actor.username}/${actor.name}`;

	return {
		name: optionName,
		value: actor.id,
		url: `${APIFY_CONSOLE_URL}/actors/${actor.id}/input`,
		description: actor.description || actor.name,
	};
};

export async function listActors(
	this: ILoadOptionsFunctions,
	searchTerm?: string,
): Promise<INodeListSearchResult> {
	const actorSource = this.getNodeParameter('actorSource', 'recentlyUsed') as string;

	const {
		data: { items: recentActors },
	} = await apiRequestAllItems.call(this, {
		method: 'GET',
		uri: '/v2/acts',
		qs: {
			limit: 1000,
			offset: 0,
			sortBy: 'stats.lastRunStartedAt',
			desc: true,
		},
	});

	if (actorSource === 'recentlyUsed') {
		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			const matches = (value?: string) => (value || '').toLowerCase().includes(term);
			const filteredActors = recentActors.filter(
				(actor: any) => matches(actor.title) || matches(actor.name),
			);
			return {
				results: filteredActors.map(mapToN8nSelectOption),
			};
		}
		return {
			results: recentActors.map(mapToN8nSelectOption),
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

	return {
		results: storeActors.map(mapToN8nSelectOption),
	};
}

/** Server Actors from Apify Store for the Send Server Actor request picker. */
export async function listServerActors(
	this: ILoadOptionsFunctions,
	searchTerm?: string,
): Promise<INodeListSearchResult> {
	const response = await apiRequest.call(this, {
		method: 'GET',
		uri: '/v2/store',
		qs: {
			category: SERVER_ACTOR_STORE_CATEGORIES,
			// Full Store items are ~5 KB each, and the Store backend caps keyword search at 100 anyway.
			limit: 100,
			offset: 0,
			...(searchTerm ? { search: searchTerm } : {}),
		},
	});
	const items: any[] = Array.isArray(response?.data?.items) ? response.data.items : [];
	return { results: items.map(mapToN8nSelectOption) };
}
