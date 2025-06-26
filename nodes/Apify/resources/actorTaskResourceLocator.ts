import { INodeProperties, ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { apiRequestAllItems } from './genericFunctions';

const resourceLocatorProperty: INodeProperties = {
	displayName: 'Actor Task',
	name: 'actorTaskId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	modes: [
		{
			displayName: 'From list',
			name: 'list',
			type: 'list',
			placeholder: 'Choose...',
			typeOptions: {
				searchListMethod: 'listActorTasks',
				searchFilterRequired: false,
				searchable: true,
			},
		},
		{
			displayName: 'By URL',
			name: 'url',
			type: 'string',
			placeholder: 'https://console.apify.com/actors/tasks/WAtmhr6rhfBnwqKDY/input',
			validation: [
				{
					type: 'regex',
					properties: {
						// https://console.apify.com/actors/tasks/WAtmhr6rhfBnwqKDY/input
						// https://console.apify.com/actors/tasks/WAtmhr6rhfBnwqKDY
						regex: 'https://console.apify.com/actors/tasks/([a-zA-Z0-9]+)(/input)?',
						errorMessage: 'Not a valid Apify Actor Task URL',
					},
				},
			],
			extractValue: {
				type: 'regex',
				// https://console.apify.com/actors/tasks/WAtmhr6rhfBnwqKDY/input -> WAtmhr6rhfBnwqKDY
				// https://console.apify.com/actors/tasks/WAtmhr6rhfBnwqKDY -> WAtmhr6rhfBnwqKDY
				regex: 'https://console.apify.com/actors/tasks/([a-zA-Z0-9]+)',
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
						errorMessage: 'Not a valid Apify Actor Task ID',
					},
				},
			],
			placeholder: 'WAtmhr6rhfBnwqKDY',
			url: '=http:/console.apify.com/actors/tasks/{{ $value }}/input',
		},
	],
};

function mapProperty(property: INodeProperties) {
	return {
		...property,
		...resourceLocatorProperty,
	};
}
export function overrideActorTaskProperties(properties: INodeProperties[]) {
	return properties.map((property) => {
		if (property.name === 'actorTaskId') {
			return mapProperty(property);
		}
		return property;
	});
}

export async function listActorTasks(
	this: ILoadOptionsFunctions,
	searchTerm?: string,
): Promise<INodeListSearchResult> {
	const searchResults = await apiRequestAllItems.call(this, {
		method: 'GET',
		uri: '/v2/actor-tasks',
		qs: {
			limit: 100,
			offset: 0,
		},
	});

	const {
		data: { items },
	} = searchResults;

	let filteredItems = [...items];
	if (searchTerm) {
		const regex = new RegExp(searchTerm, 'i');
		filteredItems = items.filter((b: any) => regex.test(b.title || '') || regex.test(b.name || ''));
	}

	return {
		results: filteredItems.map((b: any) => ({
			name: b.title || b.name,
			value: b.id,
			url: `https://console.apify.com/actors/tasks/${b.id}/input`,
			description: b.name,
		})),
	};
}
