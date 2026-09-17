import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { apiRequest, validateUrl } from '../../../resources/genericFunctions';
import { consts } from '../../../helpers';

function toHttpCode(value: unknown): string | undefined {
	const code = Number(value);
	return Number.isInteger(code) && code >= 100 && code <= 599 ? String(code) : undefined;
}

function parseHeaders(rawHeaders: string | object): object {
	if (typeof rawHeaders !== 'string') {
		if (rawHeaders && typeof rawHeaders === 'object' && !Array.isArray(rawHeaders)) {
			return rawHeaders;
		}
		return {};
	}
	const trimmed = rawHeaders.trim();
	if (!trimmed) return {};
	const parsed = JSON.parse(trimmed);
	if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
		throw new Error('not an object');
	}
	return parsed;
}

export async function webFetch(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const url = this.getNodeParameter('url', i) as string;
	const formats = this.getNodeParameter('formats', i, ['markdown']) as string[];
	const rawHeaders = this.getNodeParameter('headers', i, '{}') as string | object;

	// Web Fetch shouldn't be asked to validate for us - reject bad URLs up front.
	validateUrl.call(this, url, i);

	let headers: object;
	try {
		headers = parseHeaders(rawHeaders);
	} catch {
		throw new NodeOperationError(
			this.getNode(),
			`Invalid Headers: "${typeof rawHeaders === 'string' ? rawHeaders : JSON.stringify(rawHeaders)}". Provide a valid JSON object of header names and values, e.g. {"Accept-Language": "fr-FR"}.`,
			{ itemIndex: i },
		);
	}

	try {
		const response = await apiRequest.call(this, {
			method: 'POST',
			uri: consts.WEB_FETCH_STANDBY_URL,
			body: {
				url,
				formats,
				...(Object.keys(headers).length > 0 ? { headers } : {}),
			},
		});

		// The standby API returns the fetch metadata plus exactly the requested
		// formats from a single HTTP call - pass the envelope through verbatim.
		return { json: response };
	} catch (error) {
		// Map Web Fetch's flat { code, error } error envelope to a NodeApiError.
		// apiRequest rethrows NodeApiError as-is, keeping the parsed response
		// body on `context.data`.
		const body = error?.context?.data ?? error?.response?.body ?? error?.response?.data;
		if (body && typeof body === 'object' && !Array.isArray(body)) {
			// The custom message must be passed as an option, otherwise n8n replaces
			// it with the generic status-code message when an httpCode is present.
			if (typeof body.error === 'string' && typeof body.code === 'string') {
				throw new NodeApiError(
					this.getNode(),
					{ message: body.error },
					{
						message: body.error,
						description: `Web Fetch error code: ${body.code}`,
						httpCode: toHttpCode(error?.httpCode),
					},
				);
			}
			// Unauthenticated responses nest the details inside `error`.
			if (typeof body.error?.message === 'string') {
				throw new NodeApiError(
					this.getNode(),
					{ message: body.error.message },
					{
						message: body.error.message,
						...(typeof body.error.type === 'string'
							? { description: `Web Fetch error type: ${body.error.type}` }
							: {}),
						httpCode: toHttpCode(error?.httpCode),
					},
				);
			}
		}
		// Not a Web Fetch error envelope - rethrow as-is (a no-op passthrough
		// when `error` is already a NodeApiError).
		throw new NodeApiError(this.getNode(), error);
	}
}