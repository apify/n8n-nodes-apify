import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { getAuthedApifyClient } from '../../../helpers/apify-client';

export async function getKeyValueStoreRecord(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const storeId = this.getNodeParameter('storeId', i) as { value: string };
	const recordKey = this.getNodeParameter('recordKey', i) as { value: string };

	if (!storeId || !recordKey) {
		throw new NodeOperationError(this, 'Store ID and Record Key are required');
	}

	const client = await getAuthedApifyClient.call(this);

	try {
		const record = await client.keyValueStore(storeId.value).getRecord(recordKey.value);

		if (!record) {
			return { json: {} };
		}

		const { value, contentType } = record;

		const resultBase = {
			storeId: storeId.value,
			recordKey: recordKey.value,
			contentType,
		};

		// If not JSON or text, treat as binary
		if (
			contentType &&
			!contentType.startsWith('application/json') &&
			!contentType.startsWith('text/')
		) {
			const fileName = recordKey.value || record.key || 'file';
			const binaryData = await this.helpers.prepareBinaryData(value as any, fileName, contentType);
			return {
				json: { ...resultBase },
				binary: { data: binaryData },
			};
		}

		// Handle object
		if (typeof value === 'object') {
			return { json: { ...resultBase, value } };
		}

		// Handle other datatypes, such as HTML
		// Add `data` property since passing text as result is counted as array
		let finalData;
		try {
			finalData = typeof value === 'string' ? JSON.parse(value) : { data: value };
		} catch {
			finalData = { data: value?.toString() };
		}

		return { json: { ...resultBase, ...finalData } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
