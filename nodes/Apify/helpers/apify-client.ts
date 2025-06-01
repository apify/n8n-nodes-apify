import { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import { ApifyClient } from 'apify-client';

export async function getAuthedApifyClient(this: IExecuteFunctions | ILoadOptionsFunctions) {
	const credentials = await this.getCredentials('apifyApi');
	const client = new ApifyClient({ token: credentials.apiKey as string });
	return client;
}
