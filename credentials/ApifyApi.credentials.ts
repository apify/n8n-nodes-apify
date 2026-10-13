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

	icon = 'file:../nodes/Apify/apify-light.svg' as const;

	documentationUrl = 'https://docs.apify.com/platform/integrations/api#api-token';

	properties: INodeProperties[] = [
		{
			displayName:
				'Get your API token in <a href="https://console.apify.com/settings/integrations?utm_source=n8n&utm_medium=integrations" target="_blank">Apify Console → Settings → API &amp; Integrations</a>.',
			name: 'consoleNotice',
			type: 'notice',
			default: '',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description:
				'Your Apify API token. Find it in <a href="https://console.apify.com/settings/integrations?utm_source=n8n&utm_medium=integrations" target="_blank">Apify Console → Settings → API &amp; Integrations</a>.',
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
