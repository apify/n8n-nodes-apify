import apifyTriggerWorkflow from './workflows/webhook/webhook.workflow.json';
import { executeWorkflow } from './utils/executeWorkflow';
import { CredentialsHelper } from './utils/credentialHelper';
import * as fixtures from './utils/fixtures';
import * as genericFunctions from '../resources/genericFunctions';
import { Workflow } from 'n8n-workflow';

describe('Apify Trigger Node', () => {
	let credentialsHelper: CredentialsHelper;

	beforeAll(() => {
		credentialsHelper = new CredentialsHelper({
			apifyApi: {
				apiToken: 'test-token',
				baseUrl: 'https://api.apify.com',
			},
		});
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('checkExists', () => {
		const mockedCheckExists = async (workflow: Workflow) =>
			await (workflow.nodeTypes as any).nodeTypes[
				'n8n-nodes-apify.apifyTrigger'
			].type.webhookMethods.default.checkExists.call({
				getNodeWebhookUrl: () =>
					'http://localhost:5678/2726981e-4e01-461f-a548-1f467e997400/webhook',
				getNodeParameter: (parameterName: string) => {
					switch (parameterName) {
						case 'resource':
							return 'actor';
						case 'actorId':
							return {
								__rl: true,
								value: 'nFJndFXA5zjCTuudP',
								mode: 'list',
								cachedResultName: 'Google Search Results Scraper (apify/google-search-scraper)',
								cachedResultUrl: 'https://console.apify.com/actors/nFJndFXA5zjCTuudP/input',
							};
						case 'eventType':
							return [
								'ACTOR.RUN.SUCCEEDED',
								'ACTOR.RUN.ABORTED',
								'ACTOR.RUN.FAILED',
								'ACTOR.RUN.TIMED_OUT',
							];
						default:
							return '';
					}
				},
			});

		it('should return false in checkExists webhook method since there is any webhook created', async () => {
			jest.spyOn(genericFunctions.apiRequest as any, 'call').mockResolvedValue({
				// Spy and mock apiRequest.call to return an empty array (actor has no webhooks yet)
				data: { items: [] },
			});

			const { workflow } = await executeWorkflow({
				credentialsHelper,
				workflow: apifyTriggerWorkflow,
			});

			const result = await mockedCheckExists(workflow);
			expect(result).toEqual(false);
		});

		it('should return true in checkExists webhook method since there is a webhook created with the same url', async () => {
			jest.spyOn(genericFunctions.apiRequest as any, 'call').mockResolvedValue({
				// Spy and mock apiRequest.call to return a webhook with the same url (actor has webhooks)
				data: { items: fixtures.getActorWebhookResult().data.items },
			});

			const { workflow } = await executeWorkflow({
				credentialsHelper,
				workflow: apifyTriggerWorkflow,
			});

			const result = await mockedCheckExists(workflow);
			expect(result).toBe(true);
		});
	});

	describe('create', () => {
		const mockedCreate = async (workflow: Workflow) =>
			await (workflow.nodeTypes as any).nodeTypes[
				'n8n-nodes-apify.apifyTrigger'
			].type.webhookMethods.default.create.call({
				getNodeWebhookUrl: () =>
					'http://localhost:5678/2726981e-4e01-461f-a548-1f467e997400/webhook',
				getNodeParameter: (parameterName: string) => {
					switch (parameterName) {
						case 'resource':
							return 'actor';
						case 'actorId':
							return {
								__rl: true,
								value: 'nFJndFXA5zjCTuudP',
								mode: 'list',
								cachedResultName: 'Google Search Results Scraper (apify/google-search-scraper)',
								cachedResultUrl: 'https://console.apify.com/actors/nFJndFXA5zjCTuudP/input',
							};
						case 'eventType':
							return [
								'ACTOR.RUN.SUCCEEDED',
								'ACTOR.RUN.ABORTED',
								'ACTOR.RUN.FAILED',
								'ACTOR.RUN.TIMED_OUT',
							];
						default:
							return '';
					}
				},
				getWorkflowStaticData: () => {
					return workflow.staticData;
				},
			});

		it('should create the webhook', async () => {
			jest.spyOn(genericFunctions.apiRequest as any, 'call').mockResolvedValue({
				data: fixtures.getCreateWebhookResult().data,
			});

			const { workflow } = await executeWorkflow({
				credentialsHelper,
				workflow: apifyTriggerWorkflow,
			});

			const result = await mockedCreate(workflow);
			expect(result).toBe(true);

			const webhookData = workflow.staticData;
			expect(webhookData.webhookId).toEqual(fixtures.getCreateWebhookResult().data.id);
		});
	});

	describe('delete', () => {
		const mockedDelete = async (workflow: Workflow) =>
			await (workflow.nodeTypes as any).nodeTypes[
				'n8n-nodes-apify.apifyTrigger'
			].type.webhookMethods.default.delete.call({
				getWorkflowStaticData: () => {
					return workflow.staticData;
				},
			});
		it('should delete the webhook', async () => {
			const webhookId = fixtures.getCreateWebhookResult().data.id;

			jest.spyOn(genericFunctions.apiRequest as any, 'call').mockResolvedValue(null);

			const { workflow } = await executeWorkflow({
				credentialsHelper,
				workflow: apifyTriggerWorkflow,
			});

			const node = Object.values(workflow.nodes)[0];
			const webhookData = workflow.staticData;
			webhookData.webhookId = webhookId;

			const result = await mockedDelete(workflow);
			expect(result).toBe(true);

			expect(workflow.getStaticData('node', node)).toEqual({});
		});
	});
});
