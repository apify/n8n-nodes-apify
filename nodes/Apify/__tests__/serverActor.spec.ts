import nock from 'nock';
import { IExecuteFunctions, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { Apify } from '../Apify.node';
import { createLoadOptionsFunctions, executeWorkflow } from './utils/executeWorkflow';
import { CredentialsHelper } from './utils/credentialHelper';
import { getRunTaskDataByNodeName, getTaskData } from './utils/getNodeResultData';
import sendServerActorRequestWorkflow from './workflows/actors/send-server-actor-request.workflow.json';
import { decodeResponseBody, getErrorFromBody } from '../resources/genericFunctions';
import {
	CUSTOM_ENDPOINT,
	getServerActorOpenApi,
	MCP_ONLY,
	NO_ACTOR_SELECTED,
	NO_SERVER_INTERFACE,
} from '../resources/serverActor';
import {
	getEndpointOperation,
	parseEndpointValue,
	parseOpenApiEndpoints,
	resolveRefs,
} from '../resources/serverActorOpenApi';
import { SERVER_ACTOR_REQUEST_TIMEOUT_MS } from '../helpers/consts';

// Web Fetch (apify/web-fetch), a public Server Actor maintained by Apify. Every request below is
// answered by nock and network access is disabled, so the tests never reach the Actor.
const ACTOR_ID = 'a6Sqhlnt4touIHTub';
const SERVER_URL = 'https://web-fetch.apify.actor';

const serverActor = (overrides: object = {}) => ({
	data: {
		id: ACTOR_ID,
		standbyUrl: SERVER_URL,
		actorStandby: { isEnabled: true },
		...overrides,
	},
});

// A trimmed version of Web Fetch's OpenAPI document.
const openApi = {
	openapi: '3.0.0',
	paths: {
		'/': {
			get: {
				summary: 'Fetch a URL',
				parameters: [
					{
						name: 'url',
						in: 'query',
						required: true,
						schema: { $ref: '#/components/schemas/FetchRequest/properties/url' },
					},
					{
						name: 'formats',
						in: 'query',
						style: 'form',
						explode: false,
						schema: { $ref: '#/components/schemas/FetchRequest/properties/formats' },
					},
				],
			},
			post: {
				summary: 'Fetch a URL',
				requestBody: {
					required: true,
					content: {
						'application/json': { schema: { $ref: '#/components/schemas/FetchRequest' } },
					},
				},
			},
		},
		'/health': { get: { summary: 'Health check' } },
	},
	components: {
		schemas: {
			FetchRequest: {
				type: 'object',
				required: ['url'],
				properties: {
					url: { type: 'string' },
					formats: { type: 'array', items: { type: 'string' } },
				},
			},
		},
	},
};

const buildWith = (actorDefinition: object) => ({ data: { actorDefinition } });

const endpointWorkflow = (parameters: object) => ({
	...sendServerActorRequestWorkflow,
	nodes: sendServerActorRequestWorkflow.nodes.map((node) => ({
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

describe('Server Actors (Send Server Actor request)', () => {
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

		const actorsOperationSelects = () =>
			propertiesNamed('operation').filter(
				(property) => property.displayOptions?.show?.resource?.[0] === 'Actors',
			);

		it('should offer Send Server Actor request on both Actors operation selects', () => {
			for (const select of actorsOperationSelects()) {
				expect(select.options?.map((option: any) => option.value)).toContain(
					'Send Server Actor request',
				);
			}
			expect(actorsOperationSelects()).toHaveLength(2);
		});

		it('should leave Run an Actor unchanged, with no Interface field', () => {
			expect(propertiesNamed('interface')).toEqual([]);
		});

		it('should show the request fields only for this operation', () => {
			for (const name of [
				'endpoint',
				'endpointMethod',
				'endpointPath',
				'endpointQuery',
				'endpointBody',
			]) {
				expect(propertiesNamed(name)[0].displayOptions?.show?.operation).toEqual([
					'Send Server Actor request',
				]);
			}
		});

		it('should load endpoints for the selected Actor', () => {
			const [endpoint] = propertiesNamed('endpoint');
			expect(endpoint.typeOptions?.loadOptionsMethod).toBe('listServerActorEndpoints');
			expect(endpoint.typeOptions?.loadOptionsDependsOn).toEqual(['actorId.value']);
		});

		it('should show method and path only for Custom Path', () => {
			for (const name of ['endpointMethod', 'endpointPath']) {
				expect(propertiesNamed(name)[0].displayOptions?.show?.endpoint).toEqual([CUSTOM_ENDPOINT]);
			}
		});

		it('should show JSON query and body fields only for endpoints that take a request', () => {
			const [query] = propertiesNamed('endpointQuery');
			expect(query.displayOptions?.hide?.endpoint).toEqual(
				expect.arrayContaining(['', NO_SERVER_INTERFACE, MCP_ONLY]),
			);
			// One Body for Custom Path with a method that takes a body, one for documented endpoints
			// other than GET.
			const [customBody, documentedBody] = propertiesNamed('endpointBody');
			expect(customBody.displayOptions?.show?.endpoint).toEqual([CUSTOM_ENDPOINT]);
			expect(customBody.displayOptions?.show?.endpointMethod).toEqual([
				'POST',
				'PUT',
				'PATCH',
				'DELETE',
			]);
			expect(documentedBody.displayOptions?.hide?.endpoint).toEqual(
				expect.arrayContaining([CUSTOM_ENDPOINT, { _cnd: { startsWith: 'GET ' } }]),
			);
		});
	});

	describe('OpenAPI parsing', () => {
		it('should list endpoints, skipping utility paths', () => {
			expect(parseOpenApiEndpoints(openApi).map((option) => option.value)).toEqual([
				'GET /',
				'POST /',
			]);
		});

		it('should resolve local refs, including pointers into properties, and survive cycles', () => {
			const cyclic = { a: { $ref: '#/a' } };
			expect(() => resolveRefs(cyclic, cyclic.a)).not.toThrow();
			expect(
				resolveRefs(openApi, { $ref: '#/components/schemas/FetchRequest/properties/formats' }),
			).toEqual({ type: 'array', items: { type: 'string' } });
			expect(resolveRefs(openApi, { $ref: 'https://example.com/schema.json' })).toEqual({});
		});

		it('should resolve refs at any nesting depth, such as an enum behind a body property', () => {
			// The shape FastAPI generates: the body and its enum property are both refs.
			const document = {
				paths: {
					'/': {
						post: {
							requestBody: {
								content: {
									'application/json': { schema: { $ref: '#/components/schemas/Request' } },
								},
							},
						},
					},
				},
				components: {
					schemas: {
						Request: {
							type: 'object',
							properties: { format: { $ref: '#/components/schemas/Format' } },
						},
						Format: { type: 'string', enum: ['markdown', 'html'] },
					},
				},
			};
			const operation = getEndpointOperation(document, 'POST', '/');
			expect(operation?.bodySchema).toEqual({
				type: 'object',
				properties: { format: { type: 'string', enum: ['markdown', 'html'] } },
			});
		});

		it('should resolve a wide fan-out of $refs in time proportional to the document', () => {
			// Every schema references the next one 30 times. Expanded naively that's 30^10 nodes,
			// which would freeze n8n; with each ref resolved once it takes milliseconds.
			const schemas: Record<string, object> = {};
			for (let level = 0; level < 10; level++) {
				const properties: Record<string, object> = {};
				for (let p = 0; p < 30; p++) {
					properties[`p${p}`] =
						level < 9 ? { $ref: `#/components/schemas/L${level + 1}` } : { type: 'string' };
				}
				schemas[`L${level}`] = { type: 'object', properties };
			}
			const document = { components: { schemas } };

			const started = Date.now();
			const resolved = resolveRefs(document, { $ref: '#/components/schemas/L0' }) as any;

			expect(Date.now() - started).toBeLessThan(1000);
			expect(resolved.properties.p0.properties.p29.type).toBe('object');
		});

		it('should escape endpoint summaries, which n8n renders as HTML', () => {
			const [option] = parseOpenApiEndpoints({
				paths: { '/x': { get: { summary: 'Fetch <img src="https://evil.example/p"> now' } } },
			});
			expect(option.description).toBe(
				'Fetch &lt;img src=&quot;https://evil.example/p&quot;&gt; now',
			);
		});

		it('should parse endpoint values', () => {
			expect(parseEndpointValue('POST /')).toEqual({ method: 'POST', path: '/' });
			expect(parseEndpointValue('FOO /')).toBeUndefined();
			expect(parseEndpointValue(CUSTOM_ENDPOINT)).toBeUndefined();
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
					name: 'Send Server Actor request',
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

			expect(options.map((option) => option.value)).toEqual(['GET /', 'POST /', CUSTOM_ENDPOINT]);
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
			expect(options[0].description).toMatch(/Use the Run an Actor operation/);
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

	describe('execution', () => {
		const run = (parameters: object = {}) =>
			executeWorkflow({ credentialsHelper, workflow: endpointWorkflow(parameters) });

		const resultOf = (executionData: any) =>
			getTaskData(getRunTaskDataByNodeName(executionData, 'Send Server Actor request')[0]);

		// The Actor, plus its default build when a documented endpoint is checked against its OpenAPI.
		const mockActor = (actor = serverActor(), { withOpenApi = true } = {}) => {
			const api = nock('https://api.apify.com').get(`/v2/acts/${ACTOR_ID}`).reply(200, actor);
			return withOpenApi
				? api
						.get(`/v2/acts/${ACTOR_ID}/builds/default`)
						.reply(200, buildWith({ webServerSchema: openApi }))
				: api;
		};

		it('should send the JSON body and return status, contentType and body', async () => {
			const api = mockActor();
			const server = nock(SERVER_URL)
				.post('/', { url: 'https://example.com', formats: ['markdown', 'links'] })
				.matchHeader('x-apify-integration-platform', 'n8n')
				.reply(200, { markdown: '# Example Domain' });

			const { executionData } = await run();

			expect(resultOf(executionData)).toEqual({
				status: 200,
				contentType: 'application/json',
				body: { markdown: '# Example Domain' },
			});
			expect(api.isDone()).toBe(true);
			expect(server.isDone()).toBe(true);
		});

		it('should send Custom Path with any method to any path', async () => {
			const api = mockActor(serverActor(), { withOpenApi: false });
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
			// Custom Path doesn't look up the Actor's OpenAPI.
			expect(api.isDone()).toBe(true);
			expect(server.isDone()).toBe(true);
		});

		it('should add Query Parameters to a query string typed into Path', async () => {
			mockActor(serverActor(), { withOpenApi: false });
			const server = nock(SERVER_URL).get('/search').query({ q: 'a', limit: '5' }).reply(200, {});

			await run({
				endpoint: CUSTOM_ENDPOINT,
				endpointMethod: 'GET',
				endpointPath: '/search?q=a',
				endpointQuery: '{"limit": 5}',
			});

			expect(server.isDone()).toBe(true);
		});

		it('should return a redirect as is, so the token never follows it to another host', async () => {
			mockActor();
			nock(SERVER_URL).post('/').reply(302, '', { Location: 'https://evil.example.com/collect' });
			const elsewhere = nock('https://evil.example.com').get('/collect').reply(200, {});

			const { executionData } = await run();

			expect(resultOf(executionData)).toEqual({ status: 302, contentType: null, body: null });
			expect(elsewhere.isDone()).toBe(false);
		});

		it('should keep a path like //other.host on the Actor host', async () => {
			mockActor(serverActor(), { withOpenApi: false });
			const server = nock(SERVER_URL).get('/evil.example.com/x').reply(200, { ok: true });

			await run({
				endpoint: CUSTOM_ENDPOINT,
				endpointMethod: 'GET',
				endpointPath: '//evil.example.com/x',
				endpointQuery: '{}',
			});

			expect(server.isDone()).toBe(true);
		});

		it('should refuse an Actor whose server interface was turned off', async () => {
			nock('https://api.apify.com')
				.get(`/v2/acts/${ACTOR_ID}`)
				.reply(200, serverActor({ actorStandby: { isEnabled: false } }));

			await expect(run()).rejects.toThrow(/Use the Run an Actor operation/);
		});

		it.each([500, 429, 503])(
			"should show the Actor's own message for a %i and send the request only once",
			async (status) => {
				mockActor();
				const server = nock(SERVER_URL)
					.post('/')
					.query(true)
					.times(1)
					.reply(status, {
						error: { type: 'actor-error', message: `Requested status ${status} (TEST_ERROR)` },
					});
				// Any second request would hit this and fail the isDone() check below.
				const retry = nock(SERVER_URL).post('/').query(true).reply(200, {});

				const error = await catchError(run());

				expect(error.message).toBe(`Requested status ${status} (TEST_ERROR)`);
				expect(error.description).toContain(`Status ${status}, type actor-error`);
				expect(error.description).toContain('may still have been charged');
				expect(`${error.message} ${error.description}`).not.toMatch(/retry/i);
				expect(error.httpCode).toBe(String(status));
				expect(server.isDone()).toBe(true);
				expect(retry.isDone()).toBe(false);
			},
		);

		it('should keep an Actor message that contains a Node error code, which n8n would reword', async () => {
			mockActor();
			const message = 'Upstream request failed: connect ETIMEDOUT 93.184.216.34:443';
			nock(SERVER_URL)
				.post('/')
				.query(true)
				.reply(502, { error: { type: 'upstream-error', message } });

			const error = await catchError(run());

			expect(error.message).toBe(message);
			expect(error.message).not.toMatch(/retry/i);
		});

		it("should show Web Fetch's flat { code, error } message", async () => {
			mockActor();
			nock(SERVER_URL)
				.post('/')
				.query(true)
				.reply(400, { code: 'BAD_URL', error: 'The URL is invalid' });

			const error = await catchError(run());

			expect(error.message).toBe('The URL is invalid');
			expect(error.description).toContain('type BAD_URL');
		});

		it('should show a non-JSON error body as text', async () => {
			mockActor();
			nock(SERVER_URL)
				.post('/')
				.query(true)
				.reply(414, 'URI Too Long', { 'Content-Type': 'text/html' });

			const error = await catchError(run());

			expect(error.message).toBe('URI Too Long');
		});

		it("should turn Apify's 504 into the timeout message, keeping its text", async () => {
			mockActor();
			nock(SERVER_URL)
				.post('/')
				.query(true)
				.reply(504, { error: { type: 'timeout', message: 'Request to the Actor run timed out.' } });

			const error = await catchError(run());

			expect(error.message).toMatch(/didn't answer in time/);
			expect(error.message).toMatch(/may still have been charged/);
			expect(error.description).toContain('Request to the Actor run timed out.');
		});

		it('should map a client timeout to the timeout message without retrying', async () => {
			mockActor();
			const server = nock(SERVER_URL)
				.post('/')
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
			mockActor();
			nock(SERVER_URL)
				.post('/')
				.query(true)
				.reply(200, Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), {
					'Content-Type': 'image/png',
				});

			await expect(run()).rejects.toThrow(/binary response, which is not supported yet/);
		});

		it('should send a documented GET without a body, comma-separating arrays as its OpenAPI says', async () => {
			mockActor();
			const server = nock(SERVER_URL)
				// `formats` has `explode: false` in Web Fetch's OpenAPI.
				.get('/')
				.query({ url: 'https://example.com', formats: 'markdown,links' })
				.reply(200, {});

			await run({
				endpoint: 'GET /',
				endpointQuery: '{"url": "https://example.com", "formats": ["markdown", "links"]}',
				endpointBody: '{"ignored": true}',
			});

			expect(server.isDone()).toBe(true);
		});

		it('should repeat arrays in a Custom Path query', async () => {
			mockActor(serverActor(), { withOpenApi: false });
			const server = nock(SERVER_URL)
				.get('/')
				.query({ url: 'https://example.com', formats: ['markdown', 'links'] })
				.reply(200, {});

			await run({
				endpoint: CUSTOM_ENDPOINT,
				endpointMethod: 'GET',
				endpointPath: '/',
				endpointQuery: '{"url": "https://example.com", "formats": ["markdown", "links"]}',
			});

			expect(server.isDone()).toBe(true);
		});

		it('should fill path parameters from Query Parameters', async () => {
			const withItems = {
				paths: {
					'/items/{itemId}': {
						parameters: [{ name: 'itemId', in: 'path', required: true }],
						get: { summary: 'Get an item' },
					},
				},
			};
			nock('https://api.apify.com')
				.get(`/v2/acts/${ACTOR_ID}`)
				.reply(200, serverActor())
				.get(`/v2/acts/${ACTOR_ID}/builds/default`)
				.reply(200, buildWith({ webServerSchema: withItems }));
			// `itemId` fills the path, escaped, and is not sent as a query parameter.
			const server = nock(SERVER_URL).get('/items/a%2Fb').query({ fields: 'name' }).reply(200, {});

			await run({
				endpoint: 'GET /items/{itemId}',
				endpointQuery: '{"itemId": "a/b", "fields": "name"}',
			});

			expect(server.isDone()).toBe(true);
		});

		it('should fail clearly when a path parameter is missing, before any request', async () => {
			const api = mockActor();
			await expect(run({ endpoint: 'GET /items/{itemId}', endpointQuery: '{}' })).rejects.toThrow(
				/Missing value for path parameter "itemId". Add it to Query Parameters/,
			);
			expect(api.isDone()).toBe(false);
		});

		it.each([
			[NO_SERVER_INTERFACE, /no server interface/],
			[MCP_ONLY, /MCP Client Tool node/],
			[NO_ACTOR_SELECTED, /Choose an endpoint/],
			['', /Choose an endpoint/],
		])(
			'should explain the placeholder endpoint %p without calling the API',
			async (endpoint, message) => {
				const api = mockActor();
				await expect(run({ endpoint })).rejects.toThrow(message);
				expect(api.isDone()).toBe(false);
			},
		);

		// `toString` would match an object literal's prototype in a plain `in` lookup.
		it.each(['foo', 'toString'])(
			'should reject the malformed endpoint %p without calling the API',
			async (endpoint) => {
				const api = mockActor();
				await expect(run({ endpoint })).rejects.toThrow(`Unknown endpoint "${endpoint}"`);
				expect(api.isDone()).toBe(false);
			},
		);

		it('should look up the OpenAPI once per Actor per execution', async () => {
			const scope = nock('https://api.apify.com')
				.get(`/v2/acts/${ACTOR_ID}/builds/default`)
				.once()
				.reply(200, buildWith({ webServerSchema: openApi }));
			// Every item of an execution shares the same context object.
			const context = createLoadOptionsFunctions({
				credentialsHelper,
				node: sendServerActorRequestWorkflow.nodes[0],
			}) as unknown as IExecuteFunctions;

			const [first, second] = await Promise.all([
				getServerActorOpenApi.call(context, ACTOR_ID),
				getServerActorOpenApi.call(context, ACTOR_ID),
			]);

			expect(first).toEqual(openApi);
			expect(second).toBe(first);
			expect(scope.isDone()).toBe(true);
		});

		it("should refuse an endpoint the Actor doesn't document, without sending it", async () => {
			const api = mockActor();
			// For example an endpoint saved for the previous Actor before the Actor was changed.
			const error = await catchError(run({ endpoint: 'GET /search' }));

			expect(error.message).toMatch(/"GET \/search" isn't in this Actor's OpenAPI definition/);
			expect(api.isDone()).toBe(true);
		});

		it('should reject Query Parameters that are not a JSON object, before sending', async () => {
			const api = mockActor();
			await expect(run({ endpointQuery: '[1, 2]' })).rejects.toThrow(
				/Query Parameters must be a JSON object/,
			);
			expect(api.isDone()).toBe(false);
		});

		it('should escape Actor-supplied text in the error description, which n8n renders as HTML', async () => {
			mockActor();
			nock(SERVER_URL)
				.post('/')
				.query(true)
				.reply(400, {
					error: { type: '<img src="https://evil.example/p">', message: '<b>Bad</b> input' },
				});

			const error = await catchError(run());

			expect(error.description).toContain(
				'type &lt;img src=&quot;https://evil.example/p&quot;&gt;',
			);
			expect(error.description).not.toContain('<img');
			// The message is shown as text, so it stays readable.
			expect(error.message).toBe('<b>Bad</b> input');
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
