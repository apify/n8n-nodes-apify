import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

import { APIFY_API_URL, WEB_FETCH_STANDBY_URL } from '../nodes/Apify/helpers/consts';
// eslint-disable-next-line
export class ApifyApi implements ICredentialType {
	name = 'apifyApi';

	displayName = 'Apify API';

	icon = 'file:../nodes/Apify/apify-light.svg' as const;

	documentationUrl = 'https://docs.apify.com/platform/integrations/api#api-token';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'hidden',
			default: APIFY_API_URL,
		},
		{
			displayName: 'Web Fetch Base URL',
			name: 'webFetchBaseUrl',
			type: 'hidden',
			default: WEB_FETCH_STANDBY_URL,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v2/users/me',
		},
	};
}
