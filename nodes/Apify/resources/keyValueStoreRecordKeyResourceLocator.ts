import { INodeProperties, ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { apiRequestAllItems } from './genericFunctions';

const resourceLocatorProperty: INodeProperties = {
	displayName: 'Key-Value Store Record Key',
	name: 'recordKey',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			placeholder: 'Choose...',
			typeOptions: {
				searchListMethod: 'listKeyValueStoreRecordKeys',
				searchFilterRequired: false,
				searchable: false,
			},
		},
		{
			displayName: 'Key',

			name: 'key',
			type: 'string',
			validation: [
				{
					type: 'regex',
					properties: {
						regex: '.+',
						errorMessage: 'Please provide a Record Key',
					},
				},
			],
			placeholder: 'RECORD_KEY',
			url: '=https://api.apify.com/v2/key-value-stores/{{ $value }}/records/{{ $value }}',
		},
	],
};

function mapProperty(property: INodeProperties) {
	return {
		...property,
		...resourceLocatorProperty,
	};
}
export function overrideKeyValueStoreRecordKeyProperties(properties: INodeProperties[]) {
	return properties.map((property) => {
		if (property.name === 'recordKey') {
			return mapProperty(property);
		}
		return property;
	});
}

export async function listKeyValueStoreRecordKeys(
	this: ILoadOptionsFunctions,
): Promise<INodeListSearchResult> {
	const storeIdParam = this.getNodeParameter('storeId', null) as { value: string };

	const searchResults = await apiRequestAllItems.call(this, {
		method: 'GET',
		uri: `/v2/key-value-stores/${storeIdParam.value}/keys`,
		qs: {
			limit: 100,
			offset: 0,
		},
	});

	const {
		data: { items },
	} = searchResults;

	return {
		results: items.map((b: any) => ({
			name: b.key,
			value: b.key,
			url: `https://api.apify.com/v2/key-value-stores/${storeIdParam.value}/records/${b.key}`,
			description: b.key,
		})),
	};
}
