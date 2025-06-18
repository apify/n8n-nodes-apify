import {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import {
	apiRequest,
	compose,
	generateIdempotencyKey,
	getActorOrTaskId,
	getCondition,
	normalizeEventTypes,
} from './resources/genericFunctions';
import { listActors, overrideActorProperties } from './resources/actorResourceLocator';
import { listActorTasks, overrideActorTaskProperties } from './resources/actorTaskResourceLocator';

const triggerProperties = compose(overrideActorProperties, overrideActorTaskProperties);

export class ApifyTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Apify Trigger',
		name: 'apifyTrigger',
		icon: 'file:apify.svg',
		group: ['trigger'],
		version: 1,
		description: 'Triggers workflow on Apify Actor or task run events',
		defaults: { name: 'Apify Trigger' },
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				displayName: 'Apify API key connection',
				name: 'apifyApi',
				required: false,
				displayOptions: {
					show: {
						authentication: ['apifyApi'],
					},
				},
			},
			{
				displayName: 'Apify OAuth2 connection',
				name: 'apifyOAuth2Api',
				required: false,
				displayOptions: {
					show: {
						authentication: ['apifyOAuth2Api'],
					},
				},
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: triggerProperties([
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'API Key',
						value: 'apifyApi',
					},
					{
						name: 'OAuth2',
						value: 'apifyOAuth2Api',
					},
				],
				default: 'apifyApi',
				description: 'Choose which authentication method to use',
			},
			{
				displayName: 'Resource to Watch',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Actor', value: 'actor' },
					{ name: 'Task', value: 'task' },
				],
				default: 'actor',
				description: 'Whether to trigger when an Actor or a task run finishes',
			},
			{
				displayName: 'Actor Source',
				name: 'actorSource',
				type: 'hidden',
				displayOptions: { show: { resource: ['actor'] } },
				default: 'recentlyUsed',
			},
			{
				displayName: 'Actor',
				name: 'actorId',
				required: true,
				description: 'Actor ID or a tilde-separated username and Actor name',
				default: 'janedoe~my-actor',
				type: 'string',
				displayOptions: { show: { resource: ['actor'] } },
			},
			{
				displayName: 'Saved Tasks Name or ID',
				name: 'actorTaskId',
				type: 'string',
				default: '',
				description:
					'Apify task to monitor for runs. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
				displayOptions: { show: { resource: ['task'] } },
				placeholder: 'Select task to watch',
			},
			{
				displayName: 'Event Type',
				name: 'eventType',
				type: 'multiOptions',
				options: [
					{
						name: 'Aborted',
						value: 'ACTOR.RUN.ABORTED',
						description: 'Trigger when Actor or task run is aborted',
					},
					{ name: 'Any', value: 'any', description: 'Trigger on any terminal event' },
					{
						name: 'Failed',
						value: 'ACTOR.RUN.FAILED',
						description: 'Trigger when Actor or task run fails',
					},
					{
						name: 'Succeeded',
						value: 'ACTOR.RUN.SUCCEEDED',
						description: 'Trigger when Actor or task run completes successfully',
					},
					{
						name: 'Timed Out',
						value: 'ACTOR.RUN.TIMED_OUT',
						description: 'Trigger when Actor or task run times out',
					},
				],
				default: ['ACTOR.RUN.SUCCEEDED'],
				description: 'The status of the Actor or task run that should trigger the workflow',
			},
		]),
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const actorOrTaskId = getActorOrTaskId.call(this);

				if (!actorOrTaskId) {
					return false;
				}

				const {
					data: { items: webhooks },
				} = await apiRequest.call(this, { method: 'GET', uri: '/v2/webhooks' });

				return webhooks.some(
					(webhook: any) =>
						webhook.requestUrl === webhookUrl &&
						(webhook.condition.actorId === actorOrTaskId ||
							webhook.condition.actorTaskId === actorOrTaskId),
				);
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const resource = this.getNodeParameter('resource') as string;
				const selectedEventTypes = this.getNodeParameter('eventType', []) as string[];
				const actorOrTaskId = getActorOrTaskId.call(this);
				const webhookData = this.getWorkflowStaticData('node');

				if (!actorOrTaskId) {
					return false;
				}

				const condition = getCondition.call(this, resource, actorOrTaskId);
				const idempotencyKey = generateIdempotencyKey.call(
					this,
					resource,
					actorOrTaskId,
					selectedEventTypes,
				);
				const eventTypes = normalizeEventTypes.call(this, selectedEventTypes);

				const body: IDataObject = {
					eventTypes: eventTypes,
					requestUrl: webhookUrl,
					condition,
					idempotencyKey,
				};

				const {
					data: { id },
				} = await apiRequest.call(this, { method: 'POST', uri: '/v2/webhooks', body });
				webhookData.webhookId = id;
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				if (!webhookData.webhookId) return false;

				await apiRequest.call(this, {
					method: 'DELETE',
					uri: `/v2/webhooks/${webhookData.webhookId}`,
				});
				delete webhookData.webhookId;
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

	methods = {
		listSearch: {
			listActors,
			listActorTasks,
		},
	};
}
