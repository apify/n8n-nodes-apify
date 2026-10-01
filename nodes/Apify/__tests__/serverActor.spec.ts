import nock from 'nock';
import { Apify } from '../Apify.node';
import { executeWorkflow } from './utils/executeWorkflow';
import { CredentialsHelper } from './utils/credentialHelper';
import { getRunTaskDataByNodeName, getTaskData } from './utils/getNodeResultData';
import callServerActorWorkflow from './workflows/actors/call-server-actor.workflow.json';
import {
	CUSTOM_ENDPOINT,
	NO_SERVER_INTERFACE,
	listServerActorEndpoints,
	parseOpenApiEndpoints,
} from '../resources/serverActor';

const API = 'https://api.apify.com';
const STANDBY_HOST = 'https://janedoe--server-actor.apify.actor';
const ACTOR_ID = 'serverActorId';

const serverActor = (overrides: Record<string, any> = {}) => ({
	data: {
		id: ACTOR_ID,
		name: 'server-actor',
		username: 'janedoe',
		standbyUrl: STANDBY_HOST,
		actorStandby: { isEnabled: true, tenancy: 'MULTI_TENANT' },
		...overrides,
	},
});

const openApiSchema = {
	openapi: '3.0.0',
	info: { title: 'Server Actor', version: '1.0' },
	paths: {
		'/': { get: { summary: 'Say hello' }, post: { summary: 'Create item' } },
		'/items/{itemId}': { get: { summary: 'Get one item' }, delete: {} },
		'/health': { get: { summary: 'Health check' } },
		'/openapi.json': { get: {} },
	},
};

describe('Server Actor', () => {
	let credentialsHelper: CredentialsHelper;

	beforeEach(() => {
		new Apify();
		credentialsHelper = new CredentialsHelper({
			apifyApi: { apiToken: 'test-token', baseUrl: 'https://api.apify.com' },
		});
	});

	afterEach(() => nock.cleanAll());

	describe('parseOpenApiEndpoints', () => {
		it('lists every method of every path and skips platform/helper paths', () => {
			const endpoints = parseOpenApiEndpoints(openApiSchema);

			expect(endpoints.map((e) => e.value)).toEqual([
				'GET /',
				'POST /',
				'GET /items/{itemId}',
				'DELETE /items/{itemId}',
			]);
			expect(endpoints[0]).toMatchObject({ name: 'GET /', description: 'Say hello' });
		});

		it('accepts a schema serialized as a JSON string and tolerates garbage', () => {
			expect(parseOpenApiEndpoints(JSON.stringify(openApiSchema))).toHaveLength(4);
			expect(parseOpenApiEndpoints('not json')).toEqual([]);
			expect(parseOpenApiEndpoints(undefined)).toEqual([]);
		});
	});

	describe('listServerActorEndpoints', () => {
		const makeContext = (responses: Record<string, any>, actorId = ACTOR_ID) =>
			({
				getNodeParameter: (name: string) => (name === 'actorId' ? actorId : 'apifyApi'),
				getCurrentNodeParameter: (name: string) => (name === 'actorId' ? actorId : undefined),
				getNode: () => ({ type: 'n8n-nodes-apify.apify' }),
				getCredentials: async () => ({}),
				helpers: {
					httpRequestWithAuthentication: async (_type: string, options: any) => {
						const path = new URL(options.url).pathname;
						if (!(path in responses)) throw new Error(`unexpected request ${path}`);
						return responses[path];
					},
				},
			}) as any;

		it('offers the OpenAPI endpoints plus a custom path', async () => {
			const options = await listServerActorEndpoints.call(
				makeContext({
					[`/v2/acts/${ACTOR_ID}`]: serverActor(),
					[`/v2/acts/${ACTOR_ID}/builds/default`]: {
						data: { actorDefinition: { webServerSchema: openApiSchema } },
					},
				}),
			);

			expect(options.map((o) => o.value)).toEqual([
				'GET /',
				'POST /',
				'GET /items/{itemId}',
				'DELETE /items/{itemId}',
				CUSTOM_ENDPOINT,
			]);
		});

		it('offers only a custom path when the Actor has no OpenAPI definition', async () => {
			const options = await listServerActorEndpoints.call(
				makeContext({
					[`/v2/acts/${ACTOR_ID}`]: serverActor(),
					[`/v2/acts/${ACTOR_ID}/builds/default`]: { data: { actorDefinition: {} } },
				}),
			);

			expect(options.map((o) => o.value)).toEqual([CUSTOM_ENDPOINT]);
			expect(options[0].description).toMatch(/no OpenAPI definition/);
		});

		it('explains when the Actor has no server interface', async () => {
			const options = await listServerActorEndpoints.call(
				makeContext({
					[`/v2/acts/${ACTOR_ID}`]: serverActor({ actorStandby: { isEnabled: false } }),
				}),
			);

			expect(options).toHaveLength(1);
			expect(options[0].value).toBe(NO_SERVER_INTERFACE);
			expect(options[0].name).toMatch(/no server interface/i);
		});
	});

	describe('Call Server Actor operation', () => {
		const makeWorkflow = (parameters: Record<string, any>) => ({
			...callServerActorWorkflow,
			nodes: callServerActorWorkflow.nodes.map((node: any) => ({
				...node,
				parameters: { ...node.parameters, ...parameters },
			})),
		});

		const mockActorLookup = (overrides: Record<string, any> = {}) =>
			nock(API).get(`/v2/acts/${ACTOR_ID}`).reply(200, serverActor(overrides));

		const runNode = async (workflow: any, nodeName = 'Call Server Actor') => {
			const { executionData } = await executeWorkflow({ credentialsHelper, workflow });
			const [nodeResult] = getRunTaskDataByNodeName(executionData, nodeName);
			return getTaskData(nodeResult);
		};

		it('calls the chosen endpoint with query parameters and wraps the response', async () => {
			const api = mockActorLookup();
			const server = nock(STANDBY_HOST)
				.get('/items')
				.query({ limit: 2 })
				.reply(200, { items: [1, 2] }, { 'content-type': 'application/json' });

			const data = await runNode(callServerActorWorkflow);

			expect(data).toMatchObject({
				status: 200,
				contentType: 'application/json',
				body: { items: [1, 2] },
			});
			expect(api.isDone()).toBe(true);
			expect(server.isDone()).toBe(true);
		});

		it('fills path parameters from the query JSON and sends the body on POST', async () => {
			mockActorLookup();
			let capturedBody: any;
			const server = nock(STANDBY_HOST).delete('/items/abc').query({ dryRun: 'true' }).reply(204);
			const postServer = nock(STANDBY_HOST)
				.post('/', (body) => {
					capturedBody = body;
					return true;
				})
				.reply(201, { created: true });

			await runNode(
				makeWorkflow({
					endpoint: 'DELETE /items/{itemId}',
					queryParameters: '{"itemId": "abc", "dryRun": true}',
				}),
			);
			expect(server.isDone()).toBe(true);

			mockActorLookup();
			const data = await runNode(
				makeWorkflow({ endpoint: 'POST /', queryParameters: '{}', body: '{"name": "x"}' }),
			);
			expect(capturedBody).toEqual({ name: 'x' });
			expect(data).toMatchObject({ status: 201, body: { created: true } });
			expect(postServer.isDone()).toBe(true);
		});

		it('supports a custom method and path', async () => {
			mockActorLookup();
			const server = nock(STANDBY_HOST)
				.put('/custom/thing')
				.reply(200, 'plain text answer', { 'content-type': 'text/plain' });

			const data = await runNode(
				makeWorkflow({
					endpoint: CUSTOM_ENDPOINT,
					customMethod: 'PUT',
					customPath: 'custom/thing',
					queryParameters: '{}',
					body: '{}',
				}),
			);

			expect(data).toMatchObject({
				status: 200,
				contentType: 'text/plain',
				body: 'plain text answer',
			});
			expect(server.isDone()).toBe(true);
		});

		it('maps an Actor error to a NodeApiError and does not retry a POST', async () => {
			mockActorLookup();
			const server = nock(STANDBY_HOST)
				.post('/')
				.once()
				.reply(500, { code: 'BOOM', error: 'Actor exploded' });

			await expect(
				runNode(makeWorkflow({ endpoint: 'POST /', queryParameters: '{}', body: '{}' })),
			).rejects.toThrow(/Actor exploded/);
			expect(server.isDone()).toBe(true);
		});

		it('maps the platform error envelope', async () => {
			mockActorLookup();
			nock(STANDBY_HOST)
				.get('/items')
				.query(true)
				.reply(401, { error: { type: 'api-token-missing', message: 'Pass your API token' } });

			await expect(runNode(callServerActorWorkflow)).rejects.toThrow(/Pass your API token/);
		});

		it('fails with a clear message when the Actor has no server interface', async () => {
			mockActorLookup({ actorStandby: { isEnabled: false }, standbyUrl: null });

			await expect(runNode(callServerActorWorkflow)).rejects.toThrow(/no server interface/i);
		});
	});

	describe('Run actor with the Endpoint interface', () => {
		it('calls the Server Actor instead of starting a run', async () => {
			const workflow = {
				...callServerActorWorkflow,
				nodes: callServerActorWorkflow.nodes.map((node: any) => ({
					...node,
					name: 'Run actor',
					parameters: {
						...node.parameters,
						operation: 'Run actor',
						interface: 'endpoint',
					},
				})),
			};
			nock(API).get(`/v2/acts/${ACTOR_ID}`).reply(200, serverActor());
			const server = nock(STANDBY_HOST)
				.get('/items')
				.query({ limit: 2 })
				.reply(200, { ok: true }, { 'content-type': 'application/json' });

			const { executionData } = await executeWorkflow({ credentialsHelper, workflow });
			const [nodeResult] = getRunTaskDataByNodeName(executionData, 'Run actor');

			expect(getTaskData(nodeResult)).toMatchObject({ status: 200, body: { ok: true } });
			expect(server.isDone()).toBe(true);
		});
	});
});
