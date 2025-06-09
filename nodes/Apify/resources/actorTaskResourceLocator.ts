import { INodeProperties, ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { getAuthedApifyClient } from '../helpers/apify-client';

const resourceLocatorProperty: INodeProperties = {
	displayName: 'Actor Task',
	name: 'actorTaskId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			placeholder: 'Choose...',
			typeOptions: {
				searchListMethod: 'listActorTasks',
				searchFilterRequired: false,
				searchable: false,
			},
		},
		{
			displayName: 'By URL',
			name: 'url',
			type: 'string',
			// https://console.apify.com/actors/tasks/WAtmhr6rhfBnwqKDY/input
			placeholder: 'https://console.apify.com/actors/tasks/WAtmhr6rhfBnwqKDY/input',
			validation: [
				{
					type: 'regex',
					properties: {
						// https://console.apify.com/actors/tasks/WAtmhr6rhfBnwqKDY/input
						regex: 'https://console.apify.com/actors/tasks/([a-zA-Z0-9]+)',
						errorMessage: 'Not a valid Apify Actor Task URL',
					},
				},
			],
			extractValue: {
				type: 'regex',
				// https://console.apify.com/actors/tasks/WAtmhr6rhfBnwqKDY/input -> WAtmhr6rhfBnwqKDY
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

export async function listActorTasks(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
	const client = await getAuthedApifyClient.call(this);
	const limit = 100;
	const offset = 0;
	const { items } = await client.tasks().list({ limit, offset });

	return {
		results: items.map((b: any) => ({
			name: b.title || b.name,
			value: b.id,
			url: `https://console.apify.com/actors/tasks/${b.id}/input`,
			description: b.name,
		})),
	};
}
