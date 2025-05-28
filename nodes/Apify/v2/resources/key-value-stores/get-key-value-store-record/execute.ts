import { IExecuteFunctions, INodeExecutionData, IHttpRequestMethods } from 'n8n-workflow';
import { apiRequest } from '../../genericFunctions';

export async function getKeyValueStoreRecord(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const storeId = this.getNodeParameter('storeId', i) as { value: string };
	const recordKey = this.getNodeParameter('recordKey', i) as { value: string };

	if (!storeId || !recordKey) {
		throw new Error('Store ID and Record Key are required');
	}

	try {
		const response = await apiRequest.call(
			this,
			`/v2/key-value-stores/${storeId.value}/records/${recordKey.value}`,
			{
				method: 'GET' as IHttpRequestMethods,
				encoding: 'arraybuffer',
				returnFullResponse: true,
				json: true,
			},
		);

		const response2 = await this.helpers.httpRequestWithAuthentication.call(this, 'apifyApi', {
			method: 'GET' as IHttpRequestMethods,
			url: `https://api.apify.com/v2/key-value-stores/${storeId.value}/records/${recordKey.value}`,
			returnFullResponse: true,
			encoding: 'arraybuffer',
		});

		const fileName2 = recordKey.value || 'file';
		const contentType2 = response2.headers['content-type'] as string;
		const binaryData2 = await this.helpers.prepareBinaryData(
			response2.body,
			fileName2,
			contentType2,
		);

		console.log(binaryData2);

		const contentType = response.headers['content-type'] as string;

		// If not JSON, treat as binary
		if (!contentType.startsWith('application/json') && !contentType.startsWith('text/')) {
			const fileName = recordKey.value || 'file';

			const binaryData = await this.helpers.prepareBinaryData(response.body, fileName, contentType);

			return {
				json: { storeId: storeId.value, recordKey: recordKey.value },
				binary: {
					data: binaryData,
				},
			};
		}

		// Otherwise, parse as JSON or text
		let data;
		try {
			data = JSON.parse(response.body.toString());
		} catch {
			data = response.body.toString();
		}

		return { json: data };
	} catch (error) {
		throw new Error(error);
	}
}
