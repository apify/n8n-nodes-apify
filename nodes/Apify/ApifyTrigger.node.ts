import {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { apiRequest } from './resources/genericFunctions';

export class ApifyTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Apify Trigger',
		name: 'apifyTrigger',
		icon: 'file:apify.svg',
		group: ['trigger'],
		version: 1,
		description: 'Triggers workflow on Apify actor run events',
		defaults: { name: 'Apify Trigger' },
		inputs: [],
		outputs: ['main'],
		credentials: [{ displayName: 'Apify API', name: 'apifyApi', required: true }],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Actor ID',
				name: 'actorId',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the Apify actor to monitor for runs',
			},
			{
				displayName: 'Run Status',
				name: 'runStatus',
				type: 'options',
				required: false,
				options: [
					{ name: 'Any', value: 'any', description: 'Trigger on any status change' },
					{ name: 'Running', value: 'RUNNING', description: 'Trigger when actor run starts' },
					{
						name: 'Succeeded',
						value: 'SUCCEEDED',
						description: 'Trigger when actor run completes successfully',
					},
					{ name: 'Failed', value: 'FAILED', description: 'Trigger when actor run fails' },
					{ name: 'Aborted', value: 'ABORTED', description: 'Trigger when actor run is aborted' },
				],
				default: 'any',
				description: 'The status of the actor run that should trigger the workflow',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const actorId = this.getNodeParameter('actorId') as string;
				const {
					data: { items: webhooks },
				} = await apiRequest.call(this, 'GET', '/v2/webhooks', {}, {});

				return webhooks.some(
					(webhook: any) =>
						webhook.requestUrl === webhookUrl && webhook.condition.actorId === actorId,
				);
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const actorId = this.getNodeParameter('actorId') as string;
				const body = {
					eventTypes: ['ACTOR.RUN.SUCCEEDED'],
					requestUrl: webhookUrl,
					condition: { actorId },
				};

				const { id } = await apiRequest.call(this, 'POST', '/v2/webhooks', body);
				this.getWorkflowStaticData('node').webhookId = id;
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookId = this.getWorkflowStaticData('node').webhookId;
				if (!webhookId) return false;

				await apiRequest.call(this, 'DELETE', `/v2/webhooks/${webhookId}`, {});
				delete this.getWorkflowStaticData('node').webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		return {
			workflowData: [this.helpers.returnJsonArray(req.body as IDataObject)],
		};
	}
}
