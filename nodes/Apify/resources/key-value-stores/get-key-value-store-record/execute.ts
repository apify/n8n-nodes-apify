import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { consts } from '../../../helpers';

export async function getKeyValueStoreRecord(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const storeId = this.getNodeParameter('storeId', i) as { value: string };
	const recordKey = this.getNodeParameter('recordKey', i) as { value: string };

	if (!storeId || !recordKey) {
		throw new NodeOperationError(this.getNode(), 'Store ID and Record Key are required');
	}

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'apifyApi', {
			method: 'GET' as IHttpRequestMethods,
			url: `${consts.APIFY_API_URL}/v2/key-value-stores/${storeId.value}/records/${recordKey.value}`,
			returnFullResponse: true,
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

			const binaryData = await this.helpers.prepareBinaryData(value, fileName, contentType);
			return {
				json: { ...resultBase },
				binary: { data: binaryData },
			};
		}

		// Always get data from buffer for text or JSON
		const buffer = value;
		let finalData: any;
		if (contentType && contentType.startsWith('application/json')) {
			try {
				finalData = JSON.parse(buffer.toString('utf8'));
			} catch {
				finalData = buffer.toString('utf8');
			}
		} else if (contentType && contentType.startsWith('text/')) {
			finalData = buffer.toString('utf8');
		} else {
			// fallback: return as base64 string
			finalData = buffer.toString('base64');
		}

		return { json: { ...resultBase, data: finalData } };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
