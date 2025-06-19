import nock from 'nock';

import apifyTriggerWorkflow from './workflows/webhook/webhook.workflow.json';
import { executeWorkflow } from './utils/executeWorkflow';
import { CredentialsHelper } from './utils/credentialHelper';
import { runWebhookMethod } from './utils/runWebhookMethod';
import * as fixtures from './utils/fixtures';

describe('Apify Trigger Node', () => {
	describe('checkExists', () => {
		it('should return false in checkExists webhook method since there is any webhook created', async () => {
			const scope = nock('https://api.apify.com')
				.get('/v2/webhooks')
				.reply(200, {
					data: { items: [] },
				});

			const credentialsHelper = new CredentialsHelper({
				apifyApi: {
					apiToken: 'test-token',
					baseUrl: 'https://api.apify.com',
				},
			});

			const { workflow, additionalData } = await executeWorkflow({
				credentialsHelper,
				workflow: apifyTriggerWorkflow,
			});

			const result = await runWebhookMethod(workflow, additionalData, 'checkExists');
			expect(result).toEqual(false);

			expect(scope.isDone()).toBe(true);
		});

		it('should return true in checkExists webhook method since there is a webhook created with the same url', async () => {
			const scope = nock('https://api.apify.com')
				.get('/v2/webhooks')
				.reply(200, fixtures.getActorWebhookResult());

			const credentialsHelper = new CredentialsHelper({
				apifyApi: {
					apiToken: 'test-token',
					baseUrl: 'https://api.apify.com',
				},
			});

			const { workflow, additionalData } = await executeWorkflow({
				credentialsHelper,
				workflow: apifyTriggerWorkflow,
			});

			const result = await runWebhookMethod(workflow, additionalData, 'checkExists');
			expect(result).toBe(true);

			const node = Object.values(workflow.nodes)[0];
			expect(node.webhookId).toEqual('2726981e-4e01-461f-a548-1f467e997400');

			expect(scope.isDone()).toBe(true);
		});
	});

	describe('create', () => {
		it('should create the webhook', async () => {
			const scope = nock('https://api.apify.com')
				.post('/v2/webhooks')
				.reply(201, fixtures.getCreateWebhookResult());

			const credentialsHelper = new CredentialsHelper({
				apifyApi: {
					apiToken: 'test-token',
					baseUrl: 'https://api.apify.com',
				},
			});
			const { workflow, additionalData } = await executeWorkflow({
				credentialsHelper,
				workflow: apifyTriggerWorkflow,
			});

			const result = await runWebhookMethod(workflow, additionalData, 'create');
			expect(result).toBe(true);

			const node = Object.values(workflow.nodes)[0];
			const webhookData = workflow.getStaticData('node', node);
			expect(webhookData.webhookId).toEqual(fixtures.getCreateWebhookResult().data.id);

			expect(scope.isDone()).toBe(true);
		});
	});

	describe('delete', () => {
		it('should delete the webhook', async () => {
			const webhookId = fixtures.getCreateWebhookResult().data.id;

			const scope = nock('https://api.apify.com').delete(`/v2/webhooks/${webhookId}`).reply(204);

			const credentialsHelper = new CredentialsHelper({
				apifyApi: {
					apiToken: 'test-token',
					baseUrl: 'https://api.apify.com',
				},
			});
			const { workflow, additionalData } = await executeWorkflow({
				credentialsHelper,
				workflow: apifyTriggerWorkflow,
			});

			const node = Object.values(workflow.nodes)[0];
			const webhookData = workflow.getStaticData('node', node);
			webhookData.webhookId = webhookId;

			const result = await runWebhookMethod(workflow, additionalData, 'delete');
			expect(result).toBe(true);

			expect(workflow.getStaticData('node', node)).toEqual({});

			expect(scope.isDone()).toBe(true);
		});
	});
});
