import {
	IDataObject,
	IHookFunctions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import {
	apiRequest,
	apiRequestAllItems,
	generateIdempotencyKey,
	getActorOrTaskId,
	getCondition,
	normalizeEventTypes,
} from './resources/genericFunctions';

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
				displayName: 'Resource to Watch',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Actor', value: 'actor' },
					{ name: 'Task', value: 'task' },
				],
				default: 'actor',
				description: 'Whether to fire when an actor or a task run finishes',
			},
			{
				displayName: 'Actor Source',
				name: 'actorSource',
				description: 'Select the source of the actor to watch',
				type: 'options',
				displayOptions: { show: { resource: ['actor'] } },
				options: [
					{ name: 'Recently Used Actors', value: 'recent' },
					{ name: 'Apify Store Actors', value: 'store' },
				],
				default: 'recent',
			},
			{
				displayName: 'Recently Used Actors Name or ID',
				name: 'actorId',
				type: 'options',
				options: [],
				default: '',
				description:
					'Recently used Apify Actor to monitor for runs. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
				displayOptions: { show: { resource: ['actor'], actorSource: ['recent'] } },
				typeOptions: {
					loadOptionsMethod: 'getActors',
				},
				placeholder: 'Select Actor to watch',
			},
			{
				displayName: 'Apify Store Actors Name or ID',
				name: 'storeActorId',
				type: 'options',
				options: [],
				default: '',
				description:
					'Apify Actor to monitor for runs. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
				displayOptions: { show: { resource: ['actor'], actorSource: ['store'] } },
				typeOptions: {
					loadOptionsMethod: 'getActors',
				},
				placeholder: 'Select Actor to watch',
			},
			{
				displayName: 'Saved Tasks Name or ID',
				name: 'taskId',
				type: 'options',
				options: [],
				default: '',
				description:
					'Apify task to monitor for runs. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
				displayOptions: { show: { resource: ['task'] } },
				typeOptions: {
					loadOptionsMethod: 'getTasks',
				},
				placeholder: 'Select Task to watch',
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
				default: ['any'],
				description: 'The status of the Actor or task run that should trigger the workflow',
			},
		],
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
				} = await apiRequest.call(this, 'GET', '/v2/webhooks', {}, {});

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

	methods = {
		loadOptions: {
			async getActors(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const actorSource = this.getNodeParameter('actorSource', '') as string;
				const response = await apiRequestAllItems.call(
					this,
					'GET',
					'/v2/acts',
					{},
					{ qs: { limit: 200, offset: 0 } },
				);

				const recentActors = response.data.items;
				if (actorSource === 'recent') {
					return recentActors.map((actor: any) => ({
						name: actor.title || actor.name,
						value: actor.id,
					}));
				}

				const storeResponse = await apiRequestAllItems.call(
					this,
					'GET',
					'/v2/store',
					{},
					{ qs: { limit: 200, offset: 0 } },
				);

				const recentIds = recentActors.map((actor: any) => actor.id);
				const filtered = storeResponse.data.items.filter(
					(actor: any) => !recentIds.includes(actor.id),
				);

				return filtered.map((actor: any) => ({
					name: actor.title || actor.name,
					value: actor.id,
				}));
			},

			async getTasks(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const response = await apiRequestAllItems.call(
					this,
					'GET',
					'/v2/actor-tasks',
					{},
					{ qs: { limit: 200, offset: 0 } },
				);
				for (const task of response.data.items) {
					returnData.push({
						name: task.title || task.name,
						value: task.id,
					});
				}
				return returnData;
			},
		},
	};
}
