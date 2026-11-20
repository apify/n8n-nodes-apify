import nock from 'nock';
import { Apify } from '../Apify.node';
import { executeWorkflow } from './utils/executeWorkflow';
import { CredentialsHelper } from './utils/credentialHelper';
import { getRunTaskDataByNodeName, getTaskData } from './utils/getNodeResultData';
import sendServerActorRequestWorkflow from './workflows/actors/send-server-actor-request.workflow.json';
import { decodeResponseBody, getErrorFromBody } from '../resources/genericFunctions';
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
			for (const name of ['endpointMethod', 'endpointPath', 'endpointQuery', 'endpointBody']) {
				expect(propertiesNamed(name)[0].displayOptions?.show?.operation).toEqual([
					'Send Server Actor request',
				]);
			}
		});

		it('should show Body only for methods that send one', () => {
			const [body] = propertiesNamed('endpointBody');
			expect(body.displayOptions?.show?.endpointMethod).toEqual(['POST', 'PUT', 'PATCH', 'DELETE']);
		});
	});

	describe('execution', () => {
		const run = (parameters: object = {}) =>
			executeWorkflow({ credentialsHelper, workflow: endpointWorkflow(parameters) });

		const resultOf = (executionData: any) =>
			getTaskData(getRunTaskDataByNodeName(executionData, 'Send Server Actor request')[0]);

		const mockActor = (actor = serverActor()) =>
			nock('https://api.apify.com').get(`/v2/acts/${ACTOR_ID}`).reply(200, actor);

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

		it('should send any method to any path', async () => {
			nock('https://api.apify.com').get(`/v2/acts/${ACTOR_ID}`).reply(200, serverActor());
			const server = nock(SERVER_URL)
				.put('/v1/things', { name: 'x' })
				.query({ limit: '5' })
				.reply(201, { ok: true });

			const { executionData } = await run({
				endpointMethod: 'PUT',
				endpointPath: 'v1/things',
				endpointQuery: '{"limit": 5}',
				endpointBody: '{"name": "x"}',
			});

			expect(resultOf(executionData)).toMatchObject({ status: 201, body: { ok: true } });
			expect(server.isDone()).toBe(true);
		});

		it('should add Query Parameters to a query string typed into Path', async () => {
			mockActor();
			const server = nock(SERVER_URL).get('/search').query({ q: 'a', limit: '5' }).reply(200, {});

			await run({
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
			nock('https://api.apify.com').get(`/v2/acts/${ACTOR_ID}`).reply(200, serverActor());
			const server = nock(SERVER_URL).get('/evil.example.com/x').reply(200, { ok: true });

			await run({
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

		it('should send GET with query parameters only, repeating arrays', async () => {
			mockActor();
			const server = nock(SERVER_URL)
				.get('/')
				.query({ url: 'https://example.com', formats: ['markdown', 'links'] })
				.reply(200, {});

			await run({
				endpointMethod: 'GET',
				endpointPath: '/',
				endpointQuery: '{"url": "https://example.com", "formats": ["markdown", "links"]}',
				// Not sent with GET.
				endpointBody: '{"ignored": true}',
			});

			expect(server.isDone()).toBe(true);
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
