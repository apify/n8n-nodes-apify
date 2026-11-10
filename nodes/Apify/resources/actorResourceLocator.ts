import { INodeProperties, ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { SERVER_ACTORS_LIST_PATH } from '../helpers/consts';
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
			url: '=https://console.apify.com/actors/{{$value}}/input',
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
		url: `https://console.apify.com/actors/${actor.id}/input`,
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
			const regex = new RegExp(searchTerm, 'i');
			const filteredActors = recentActors.filter(
				(actor: any) => regex.test(actor.title || '') || regex.test(actor.name || ''),
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

/** True when every word of the search term appears in the Actor's title, name, username or description. */
function matchesSearch(actor: any, searchTerm: string): boolean {
	const haystack = [actor.title, actor.name, actor.username, actor.description]
		.filter((value) => typeof value === 'string')
		.join(' ')
		.toLowerCase();
	return searchTerm
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean)
		.every((word) => haystack.includes(word));
}

/**
 * Server Actors for the picker, read from `listPath` in the shape of `GET /v2/store`
 * (`{ data: { items } }`). A key-value store record (today's static snapshot) ignores `search`,
 * so it is filtered here; the Store API filters on its own.
 */
export async function searchServerActors(
	this: ILoadOptionsFunctions,
	searchTerm = '',
	listPath = SERVER_ACTORS_LIST_PATH,
): Promise<INodeListSearchResult> {
	const response = await apiRequest.call(this, {
		method: 'GET',
		uri: listPath,
		qs: { limit: 1000, offset: 0, ...(searchTerm ? { search: searchTerm } : {}) },
	});
	const items: any[] = Array.isArray(response?.data?.items) ? response.data.items : [];
	const isStaticSnapshot = listPath.includes('/key-value-stores/');
	const actors =
		isStaticSnapshot && searchTerm
			? items.filter((actor) => matchesSearch(actor, searchTerm))
			: items;
	return { results: actors.map(mapToN8nSelectOption) };
}

export async function listServerActors(
	this: ILoadOptionsFunctions,
	searchTerm?: string,
): Promise<INodeListSearchResult> {
	return await searchServerActors.call(this, searchTerm);
}
