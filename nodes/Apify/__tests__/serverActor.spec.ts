import nock from 'nock';
import { ILoadOptionsFunctions, INodePropertyOptions, ResourceMapperFields } from 'n8n-workflow';
import { Apify } from '../Apify.node';
import { createLoadOptionsFunctions, executeWorkflow } from './utils/executeWorkflow';
import { CredentialsHelper } from './utils/credentialHelper';
import { getRunTaskDataByNodeName, getTaskData } from './utils/getNodeResultData';
import runActorEndpointWorkflow from './workflows/actors/run-actor-endpoint.workflow.json';
import runActorWorkflow from './workflows/actors/run-actor.workflow.json';
import * as fixtures from './utils/fixtures';
import {
	decodeResponseBody,
	getErrorFromBody,
	CUSTOM_ENDPOINT,
	MCP_ONLY,
	NO_SERVER_INTERFACE,
} from '../resources/serverActor';
import {
	getEndpointFields,
	parseEndpointValue,
	parseFieldId,
	parseOpenApiEndpoints,
	resolveRefs,
} from '../resources/serverActorOpenApi';
import { SERVER_ACTOR_REQUEST_TIMEOUT_MS } from '../helpers/consts';

const ACTOR_ID = 'UE4RePbgER1Xt3ZVb';
const SERVER_URL = 'https://jan-hranicky--server-actor-spike.apify.actor';

const serverActor = (overrides: object = {}) => ({
	data: {
		id: ACTOR_ID,
		standbyUrl: SERVER_URL,
		actorStandby: { isEnabled: true },
		...overrides,
	},
});

const openApi = {
	openapi: '3.0.3',
	paths: {
		'/echo': {
			post: {
				summary: 'Echo a typed JSON body',
				parameters: [{ name: 'probe', in: 'query', schema: { type: 'string' } }],
				requestBody: {
					required: true,
					content: { 'application/json': { schema: { $ref: '#/components/schemas/Echo' } } },
				},
			},
		},
		'/items/{itemId}': {
			parameters: [{ name: 'itemId', in: 'path', required: true, schema: { type: 'string' } }],
			get: {
				summary: 'Get an item',
				parameters: [
					{
						name: 'formats',
						in: 'query',
						style: 'form',
						explode: false,
						schema: { $ref: '#/components/schemas/Echo/properties/tags' },
					},
				],
			},
		},
		'/health': { get: { summary: 'Health check' } },
	},
	components: {
		schemas: {
			Echo: {
				type: 'object',
				required: ['text'],
				properties: {
					text: { type: 'string' },
					count: { type: 'integer' },
					flag: { type: 'boolean' },
					tags: { type: 'array', items: { type: 'string' } },
					mode: { type: 'string', enum: ['fast', 'slow'] },
					nested: { type: 'object', properties: { a: { type: 'string' } } },
				},
			},
		},
	},
};

const buildWith = (actorDefinition: object) => ({ data: { actorDefinition } });

const endpointWorkflow = (parameters: object) => ({
	...runActorEndpointWorkflow,
	nodes: runActorEndpointWorkflow.nodes.map((node) => ({
		...node,
		parameters: { ...node.parameters, ...parameters },
	})),
});

const catchError = async (promise: Promise<unknown>): Promise<any> => {
	try {
		await promise;
	} catch (error) {
		return error;
	}
	throw new Error('Expected the promise to reject');
};

describe('Server Actors (Run actor, Interface = Endpoint)', () => {
	let apifyNode: Apify;
	let credentialsHelper: CredentialsHelper;

	beforeEach(() => {
		nock.cleanAll();
		apifyNode = new Apify();
		credentialsHelper = new CredentialsHelper({
			apifyApi: { apiToken: 'test-token', baseUrl: 'https://api.apify.com' },
		});
	});

	beforeAll(() => nock.disableNetConnect());
	afterAll(() => {
		nock.cleanAll();
		nock.enableNetConnect();
	});

	describe('description', () => {
		const propertiesNamed = (name: string) =>
			apifyNode.description.properties.filter((property) => property.name === name);

		it('should default Interface to Input so saved nodes keep starting runs', () => {
			const [interfaceProperty] = propertiesNamed('interface');
			expect(interfaceProperty.default).toBe('input');
			expect(interfaceProperty.displayOptions?.show?.operation).toEqual(['Run actor']);
		});

		it('should show the run fields only for the Input interface', () => {
			for (const name of ['waitForFinish', 'memory', 'timeout', 'build', 'maxTotalChargeUsd']) {
				const runActorProperty = propertiesNamed(name).find(
					(property) => property.displayOptions?.show?.operation?.[0] === 'Run actor',
				);
				expect(runActorProperty?.displayOptions?.show?.interface).toEqual(['input']);
			}
		});

		it('should load endpoints for the selected Actor and fields for the selected endpoint', () => {
			const [endpoint] = propertiesNamed('endpoint');
			expect(endpoint.typeOptions?.loadOptionsMethod).toBe('listServerActorEndpoints');
			expect(endpoint.typeOptions?.loadOptionsDependsOn).toEqual(['actorId.value']);
			const [fields] = propertiesNamed('endpointParameters');
			expect(fields.typeOptions?.loadOptionsDependsOn).toEqual(['actorId.value', 'endpoint']);
			// No empty Parameters box before a documented endpoint is chosen.
			expect(fields.displayOptions?.hide?.endpoint).toEqual(
				expect.arrayContaining(['', CUSTOM_ENDPOINT, NO_SERVER_INTERFACE, MCP_ONLY]),
			);
		});

		it('should keep the Actor input resource mapper registered next to the endpoint one', () => {
			expect(Object.keys(apifyNode.methods!.resourceMapping!)).toEqual(
				expect.arrayContaining(['getActorInputFields', 'getServerActorEndpointFields']),
			);
		});
	});

	describe('OpenAPI parsing', () => {
		it('should list endpoints, skipping utility paths', () => {
			expect(parseOpenApiEndpoints(openApi).map((option) => option.value)).toEqual([
				'POST /echo',
				'GET /items/{itemId}',
			]);
		});

		it('should resolve local refs, including pointers into properties, and survive cycles', () => {
			const cyclic = { a: { $ref: '#/a' } };
			expect(() => resolveRefs(cyclic, cyclic.a)).not.toThrow();
			expect(resolveRefs(openApi, { $ref: '#/components/schemas/Echo/properties/tags' })).toEqual({
				type: 'array',
				items: { type: 'string' },
			});
			expect(resolveRefs(openApi, { $ref: 'https://example.com/schema.json' })).toEqual({});
		});

		it('should turn parameters and body properties into typed fields', () => {
			const fields = getEndpointFields(openApi, 'POST', '/echo')!;
			const byId = Object.fromEntries(fields.map((field) => [field.id, field]));

			expect(Object.keys(byId)).toEqual([
				'query:probe',
				'body:text',
				'body:count',
				'body:flag',
				'body:tags',
				'body:mode',
				'body:nested',
			]);
			expect(byId['body:text']).toMatchObject({ type: 'string', required: true, removed: false });
			expect(byId['body:count']).toMatchObject({ type: 'number', required: false, removed: true });
			expect(byId['body:flag'].type).toBe('boolean');
			expect(byId['body:tags'].type).toBe('array');
			expect(byId['body:nested'].type).toBe('object');
			expect(byId['body:mode']).toMatchObject({
				type: 'options',
				options: [
					{ name: 'fast', value: 'fast' },
					{ name: 'slow', value: 'slow' },
				],
			});
		});

		it('should make path parameters required and merge path-level parameters', () => {
			const fields = getEndpointFields(openApi, 'GET', '/items/{itemId}')!;
			expect(fields.map((field) => [field.id, field.required, field.type])).toEqual([
				['path:itemId', true, 'string'],
				['query:formats', false, 'array'],
			]);
		});

		it('should use one JSON field for a body without properties and label name clashes', () => {
			const document = {
				paths: {
					'/run': {
						post: {
							parameters: [{ name: 'mode', in: 'query' }],
							requestBody: {
								content: { 'application/json': { schema: { type: 'array' } } },
							},
						},
					},
					'/clash': {
						post: {
							parameters: [{ name: 'mode', in: 'query' }],
							requestBody: {
								content: {
									'application/json': {
										schema: { type: 'object', properties: { mode: { type: 'string' } } },
									},
								},
							},
						},
					},
				},
			};
			expect(getEndpointFields(document, 'POST', '/run')!.map((field) => field.id)).toEqual([
				'query:mode',
				'body',
			]);
			expect(
				getEndpointFields(document, 'POST', '/clash')!.map((field) => field.displayName),
			).toEqual(['mode (query)', 'mode (body)']);
		});

		it('should parse endpoint values and field ids', () => {
			expect(parseEndpointValue('POST /echo')).toEqual({ method: 'POST', path: '/echo' });
			expect(parseEndpointValue('FOO /echo')).toBeUndefined();
			expect(parseEndpointValue(CUSTOM_ENDPOINT)).toBeUndefined();
			expect(parseFieldId('query:a:b')).toEqual({ location: 'query', name: 'a:b' });
			expect(parseFieldId('body')).toEqual({ location: 'wholeBody', name: 'body' });
		});
	});

	describe('endpoint list (loadOptions)', () => {
		const listEndpoints = () =>
			apifyNode.methods!.loadOptions!.listServerActorEndpoints as (
				this: ILoadOptionsFunctions,
			) => Promise<INodePropertyOptions[]>;

		const context = (actorId = ACTOR_ID) =>
			createLoadOptionsFunctions({
				credentialsHelper,
				node: {
					name: 'Run actor',
					type: 'n8n-nodes-apify.apify',
					typeVersion: 2,
					parameters: { actorId: { __rl: true, mode: 'list', value: actorId } },
				},
			});

		it('should list the OpenAPI endpoints plus Custom Path', async () => {
			const scope = nock('https://api.apify.com')
				.get(`/v2/acts/${ACTOR_ID}`)
				.reply(200, serverActor())
				.get(`/v2/acts/${ACTOR_ID}/builds/default`)
				.reply(200, buildWith({ webServerSchema: JSON.stringify(openApi) }));

			const options = await listEndpoints().call(context());

			expect(options.map((option) => option.value)).toEqual([
				'POST /echo',
				'GET /items/{itemId}',
				CUSTOM_ENDPOINT,
			]);
			expect(scope.isDone()).toBe(true);
		});

		it('should offer only Custom Path with a README link when there is no OpenAPI', async () => {
			const scope = nock('https://api.apify.com')
				.get(`/v2/acts/${ACTOR_ID}`)
				.reply(200, serverActor())
				.get(`/v2/acts/${ACTOR_ID}/builds/default`)
				.reply(200, buildWith({}));

			const options = await listEndpoints().call(context());

			expect(options).toHaveLength(1);
			expect(options[0].value).toBe(CUSTOM_ENDPOINT);
			expect(options[0].description).toContain(
				`https://console.apify.com/actors/${ACTOR_ID}/information/latest/readme`,
			);
			expect(scope.isDone()).toBe(true);
		});

		it('should say when the Actor has no server interface, without Custom Path', async () => {
			const scope = nock('https://api.apify.com')
				.get(`/v2/acts/${ACTOR_ID}`)
				.reply(200, serverActor({ actorStandby: { isEnabled: false } }));

			const options = await listEndpoints().call(context());

			expect(options.map((option) => option.value)).toEqual([NO_SERVER_INTERFACE]);
			expect(options[0].description).toMatch(/Switch Interface to Input/);
			expect(scope.isDone()).toBe(true);
		});

		it('should point MCP-only Actors to the MCP Client nodes, without Custom Path', async () => {
			const scope = nock('https://api.apify.com')
				.get(`/v2/acts/${ACTOR_ID}`)
				.reply(200, serverActor())
				.get(`/v2/acts/${ACTOR_ID}/builds/default`)
				.reply(200, buildWith({ webServerMcpPath: '/mcp' }));

			const options = await listEndpoints().call(context());

			expect(options.map((option) => option.value)).toEqual([MCP_ONLY]);
			expect(options[0].description).toMatch(/MCP Client Tool node/);
			expect(options[0].description).toMatch(/60 s/);
			expect(scope.isDone()).toBe(true);
		});

		it('should never treat a standby URL outside apify.actor as a server interface', async () => {
			nock('https://api.apify.com')
				.get(`/v2/acts/${ACTOR_ID}`)
				.reply(200, serverActor({ standbyUrl: 'https://evil.example.com' }));

			const options = await listEndpoints().call(context());

			expect(options.map((option) => option.value)).toEqual([NO_SERVER_INTERFACE]);
		});

		it('should ask for an Actor when none is selected, without calling the API', async () => {
			const options = await listEndpoints().call(context(''));
			expect(options[0].name).toMatch(/Select an Actor/);
		});
	});

	describe('endpoint fields (resourceMapper)', () => {
		const getFields = () =>
			apifyNode.methods!.resourceMapping!.getServerActorEndpointFields as (
				this: ILoadOptionsFunctions,
			) => Promise<ResourceMapperFields>;

		const context = (endpoint: string) =>
			createLoadOptionsFunctions({
				credentialsHelper,
				node: {
					name: 'Run actor',
					type: 'n8n-nodes-apify.apify',
					typeVersion: 2,
					parameters: { actorId: { __rl: true, mode: 'list', value: ACTOR_ID }, endpoint },
				},
			});

		it("should load the selected endpoint's fields from the default build", async () => {
			const scope = nock('https://api.apify.com')
				.get(`/v2/acts/${ACTOR_ID}/builds/default`)
				.reply(200, buildWith({ webServerSchema: openApi }));

			const { fields } = await getFields().call(context('POST /echo'));

			expect(fields.map((field) => field.id)).toContain('body:text');
			expect(scope.isDone()).toBe(true);
		});

		it('should show a notice instead of failing when the build cannot be loaded', async () => {
			nock('https://api.apify.com')
				.get(`/v2/acts/${ACTOR_ID}/builds/default`)
				.reply(404, { error: { type: 'record-not-found', message: 'Build not found' } });

			const result = await getFields().call(context('POST /echo'));

			expect(result.fields).toEqual([]);
			expect(result.emptyFieldsNotice).toMatch(/Could not load/);
		});

		it('should say when the endpoint takes no parameters', async () => {
			nock('https://api.apify.com')
				.get(`/v2/acts/${ACTOR_ID}/builds/default`)
				.reply(200, buildWith({ webServerSchema: { paths: { '/': { get: {} } } } }));

			const result = await getFields().call(context('GET /'));

			expect(result.emptyFieldsNotice).toMatch(/no parameters/);
		});
	});

	describe('execution', () => {
		const run = (parameters: object = {}) =>
			executeWorkflow({ credentialsHelper, workflow: endpointWorkflow(parameters) });

		const resultOf = (executionData: any) =>
			getTaskData(getRunTaskDataByNodeName(executionData, 'Run actor')[0]);

		it('should keep starting a run when a saved node has no Interface value', async () => {
			const scope = nock('https://api.apify.com')
				.get('/v2/acts/nFJndFXA5zjCTuudP')
				.reply(200, fixtures.getActorResult())
				.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
				.reply(200, fixtures.getBuildResult())
				.post('/v2/acts/nFJndFXA5zjCTuudP/runs')
				.query(true)
				.reply(200, fixtures.runActorResult());

			const { executionData } = await executeWorkflow({
				credentialsHelper,
				workflow: runActorWorkflow,
			});

			expect(resultOf(executionData)?.id).toBe(fixtures.runActorResult().data.id);
			expect(scope.isDone()).toBe(true);
		});

		it('should send typed fields to the right place and return status, contentType and body', async () => {
			const api = nock('https://api.apify.com')
				.get(`/v2/acts/${ACTOR_ID}`)
				.reply(200, serverActor());
			const server = nock(SERVER_URL)
				.post('/echo', { text: 'hello', count: 2, tags: ['a', 'b'] })
				.query({ probe: 'n8n-test' })
				.matchHeader('x-apify-integration-platform', 'n8n')
				.reply(200, { received: { text: 'hello' } });

			const { executionData } = await run();

			expect(resultOf(executionData)).toEqual({
				status: 200,
				contentType: 'application/json',
				body: { received: { text: 'hello' } },
			});
			expect(api.isDone()).toBe(true);
			expect(server.isDone()).toBe(true);
		});

		it('should fill path parameters and send explode: false arrays comma-separated', async () => {
			const api = nock('https://api.apify.com')
				.get(`/v2/acts/${ACTOR_ID}`)
				.reply(200, serverActor())
				.get(`/v2/acts/${ACTOR_ID}/builds/default`)
				.reply(200, buildWith({ webServerSchema: openApi }));
			const server = nock(SERVER_URL)
				.get('/items/a%2Fb')
				.query({ formats: 'markdown,html' })
				.reply(200, 'plain text', { 'Content-Type': 'text/plain; charset=utf-8' });

			const { executionData } = await run({
				endpoint: 'GET /items/{itemId}',
				endpointParameters: {
					mappingMode: 'defineBelow',
					value: { 'path:itemId': 'a/b', 'query:formats': ['markdown', 'html'] },
				},
			});

			expect(resultOf(executionData)).toEqual({
				status: 200,
				contentType: 'text/plain',
				body: 'plain text',
			});
			expect(api.isDone()).toBe(true);
			expect(server.isDone()).toBe(true);
		});

		it('should fail clearly when a path parameter is missing, before any request', async () => {
			await expect(
				run({
					endpoint: 'GET /items/{itemId}',
					endpointParameters: { mappingMode: 'defineBelow', value: {} },
				}),
			).rejects.toThrow(/Missing value for path parameter "itemId"/);
		});

		it('should send a Custom Path request with JSON query and body', async () => {
			nock('https://api.apify.com').get(`/v2/acts/${ACTOR_ID}`).reply(200, serverActor());
			const server = nock(SERVER_URL)
				.put('/v1/things', { name: 'x' })
				.query({ limit: '5' })
				.reply(201, { ok: true });

			const { executionData } = await run({
				endpoint: CUSTOM_ENDPOINT,
				endpointMethod: 'PUT',
				endpointPath: 'v1/things',
				endpointQuery: '{"limit": 5}',
				endpointBody: '{"name": "x"}',
			});

			expect(resultOf(executionData)).toMatchObject({ status: 201, body: { ok: true } });
			expect(server.isDone()).toBe(true);
		});

		it('should keep a Custom Path like //other.host on the Actor host', async () => {
			nock('https://api.apify.com').get(`/v2/acts/${ACTOR_ID}`).reply(200, serverActor());
			const server = nock(SERVER_URL).get('/evil.example.com/x').reply(200, { ok: true });

			await run({
				endpoint: CUSTOM_ENDPOINT,
				endpointMethod: 'GET',
				endpointPath: '//evil.example.com/x',
			});

			expect(server.isDone()).toBe(true);
		});

		it.each([
			[NO_SERVER_INTERFACE, /no server interface/],
			[MCP_ONLY, /MCP Client Tool node/],
			['', /Choose an endpoint/],
		])(
			'should explain the placeholder endpoint %p without calling the API',
			async (endpoint, message) => {
				await expect(run({ endpoint })).rejects.toThrow(message);
			},
		);

		it('should refuse an Actor whose server interface was turned off', async () => {
			nock('https://api.apify.com')
				.get(`/v2/acts/${ACTOR_ID}`)
				.reply(200, serverActor({ actorStandby: { isEnabled: false } }));

			await expect(run()).rejects.toThrow(/Switch Interface to Input/);
		});

		it.each([500, 429, 503])(
			"should show the Actor's own message for a %i and send the request only once",
			async (status) => {
				nock('https://api.apify.com').get(`/v2/acts/${ACTOR_ID}`).reply(200, serverActor());
				const server = nock(SERVER_URL)
					.post('/echo')
					.query(true)
					.times(1)
					.reply(status, {
						error: { type: 'spike-error', message: `Requested status ${status} (TEST_ERROR)` },
					});
				// Any second request would hit this and fail the isDone() check below.
				const retry = nock(SERVER_URL).post('/echo').query(true).reply(200, {});

				const error = await catchError(run());

				expect(error.message).toBe(`Requested status ${status} (TEST_ERROR)`);
				expect(error.description).toContain(`Status ${status}, type spike-error`);
				expect(error.description).toContain('may still have been charged');
				expect(`${error.message} ${error.description}`).not.toMatch(/retry/i);
				expect(error.httpCode).toBe(String(status));
				expect(server.isDone()).toBe(true);
				expect(retry.isDone()).toBe(false);
			},
		);

		it("should show Web Fetch's flat { code, error } message", async () => {
			nock('https://api.apify.com').get(`/v2/acts/${ACTOR_ID}`).reply(200, serverActor());
			nock(SERVER_URL)
				.post('/echo')
				.query(true)
				.reply(400, { code: 'BAD_URL', error: 'The URL is invalid' });

			const error = await catchError(run());

			expect(error.message).toBe('The URL is invalid');
			expect(error.description).toContain('type BAD_URL');
		});

		it('should show a non-JSON error body as text', async () => {
			nock('https://api.apify.com').get(`/v2/acts/${ACTOR_ID}`).reply(200, serverActor());
			nock(SERVER_URL)
				.post('/echo')
				.query(true)
				.reply(414, 'URI Too Long', { 'Content-Type': 'text/html' });

			const error = await catchError(run());

			expect(error.message).toBe('URI Too Long');
		});

		it("should turn Apify's 504 into the timeout message, keeping its text", async () => {
			nock('https://api.apify.com').get(`/v2/acts/${ACTOR_ID}`).reply(200, serverActor());
			nock(SERVER_URL)
				.post('/echo')
				.query(true)
				.reply(504, { error: { type: 'timeout', message: 'Request to the Actor run timed out.' } });

			const error = await catchError(run());

			expect(error.message).toMatch(/didn't answer in time/);
			expect(error.message).toMatch(/may still have been charged/);
			expect(error.description).toContain('Request to the Actor run timed out.');
		});

		it('should map a client timeout to the timeout message without retrying', async () => {
			nock('https://api.apify.com').get(`/v2/acts/${ACTOR_ID}`).reply(200, serverActor());
			const server = nock(SERVER_URL)
				.post('/echo')
				.query(true)
				.times(1)
				.replyWithError(
					Object.assign(new Error('timeout of 310000ms exceeded'), { code: 'ECONNABORTED' }),
				);

			const error = await catchError(run());

			expect(error.message).toMatch(/didn't answer in time/);
			expect(error.message).not.toMatch(/offline|retry/i);
			expect(server.isDone()).toBe(true);
		});

		it('should fail clearly on a binary response', async () => {
			nock('https://api.apify.com').get(`/v2/acts/${ACTOR_ID}`).reply(200, serverActor());
			nock(SERVER_URL)
				.post('/echo')
				.query(true)
				.reply(200, Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), {
					'Content-Type': 'image/png',
				});

			await expect(run()).rejects.toThrow(/binary response, which is not supported yet/);
		});

		it('should wait longer than Apify’s 300 s limit', () => {
			expect(SERVER_ACTOR_REQUEST_TIMEOUT_MS).toBeGreaterThan(300_000);
		});
	});

	describe('response decoding', () => {
		it.each([
			['application/json', '{"a":1}', { body: { a: 1 } }],
			['application/problem+json', '{"a":1}', { body: { a: 1 } }],
			['application/json', 'not json', { body: 'not json' }],
			['text/html', '<p>hi</p>', { body: '<p>hi</p>' }],
			['text/event-stream', 'data: 1\n\n', { body: 'data: 1\n\n' }],
			['', '{"a":1}', { body: { a: 1 } }],
			['', 'plain', { body: 'plain' }],
			['application/json', '', { body: null }],
		])('should decode %p %p', (contentType, text, expected) => {
			expect(decodeResponseBody(Buffer.from(text), contentType)).toEqual(expected);
		});

		it('should detect binary bodies by content type or invalid UTF-8', () => {
			expect(decodeResponseBody(Buffer.from('x'), 'application/pdf')).toEqual({ binary: true });
			expect(decodeResponseBody(Buffer.from([0xff, 0xfe, 0x00]), '')).toEqual({ binary: true });
		});

		it('should find error messages in the common body shapes', () => {
			expect(getErrorFromBody({ error: { type: 't', message: 'm' } })).toEqual({
				message: 'm',
				type: 't',
			});
			expect(getErrorFromBody({ error: 'm', code: 'c' })).toEqual({ message: 'm', type: 'c' });
			expect(getErrorFromBody({ detail: 'm' })).toEqual({ message: 'm', type: undefined });
			expect(getErrorFromBody('  text  ')).toEqual({ message: 'text' });
			expect(getErrorFromBody([1])).toEqual({});
		});
	});
});
