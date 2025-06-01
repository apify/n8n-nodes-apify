import { INodeProperties, ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { getAuthedApifyClient } from '../helpers/apify-client';

const resourceLocatorProperty: INodeProperties = {
	displayName: 'Key-Value Store ID',
	name: 'storeId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			placeholder: 'Choose...',
			typeOptions: {
				searchListMethod: 'listKeyValueStores',
				searchFilterRequired: false,
				searchable: false,
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
						errorMessage: 'Not a valid Key-Value Store ID',
					},
				},
			],
			placeholder: 'dmXls2mjfQVdzfrC6',
			url: '=https://console.apify.com/storage/key-value-stores/{{ $value }}',
		},
	],
};

function mapProperty(property: INodeProperties) {
	return {
		...property,
		...resourceLocatorProperty,
	};
}
export function overrideKeyValueStoreProperties(properties: INodeProperties[]) {
	return properties.map((property) => {
		if (property.name === 'storeId') {
			return mapProperty(property);
		}
		return property;
	});
}

export async function listKeyValueStores(
	this: ILoadOptionsFunctions,
): Promise<INodeListSearchResult> {
	const client = await getAuthedApifyClient.call(this);
	const limit = 100;
	const offset = 0;
	const { items } = await client.keyValueStores().list({ limit, offset });

	return {
		results: items.map((b: any) => ({
			name: b.name,
			value: b.id,
			url: `https://console.apify.com/storage/key-value-stores/${b.id}`,
			description: b.name,
		})),
	};
}
