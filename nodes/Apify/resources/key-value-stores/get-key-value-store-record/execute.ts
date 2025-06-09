import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { apiRequest } from '../../genericFunctions';

export async function getKeyValueStoreRecord(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const storeId = this.getNodeParameter('storeId', i) as { value: string };
	const recordKey = this.getNodeParameter('recordKey', i) as { value: string };

	if (!storeId || !recordKey) {
		throw new NodeOperationError(this, 'Store ID and Record Key are required');
	}

	try {
		const response = await apiRequest.call(this, {
			method: 'GET',
			uri: `/v2/key-value-stores/${storeId.value}/records/${recordKey.value}`,
			json: true,
			resolveWithFullResponse: true,
			encoding: 'arraybuffer',
		});

		if (!response) {
			return { json: {} };
		}

		const contentType = response.headers['content-type'] as string;
		const value = response.body;

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
			const fileName = recordKey.value || response.key || 'file';

			const buffer = Buffer.from(value);
			const binaryData = await this.helpers.prepareBinaryData(buffer, fileName, contentType);
			return {
				json: { ...resultBase },
				binary: { data: binaryData },
			};
		}

		// Handle object
		if (typeof value === 'object') {
			return { json: { ...resultBase, data: value } };
		}

		// Handle other datatypes, such as HTML
		// Add `data` property since passing text as result is counted as array
		let finalData;
		try {
			finalData = typeof value === 'string' ? JSON.parse(value) : value;
		} catch {
			finalData = value?.toString();
		}

		return { json: { ...resultBase, data: finalData } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
