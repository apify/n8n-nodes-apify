import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

import { APIFY_API_URL } from '../nodes/Apify/helpers/consts';
// eslint-disable-next-line
export class ApifyApi implements ICredentialType {
	name = 'apifyApi';

	displayName = 'Apify API';

	documentationUrl = 'https://docs.apify.com/platform/integrations/api#api-token';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
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
			baseURL: APIFY_API_URL,
			url: '/v2/users/me',
		},
	};
}
