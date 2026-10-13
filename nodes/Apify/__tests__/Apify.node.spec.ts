import nock from 'nock';
import { ILoadOptionsFunctions, NodeOperationError, ResourceMapperFields } from 'n8n-workflow';
import { Apify } from '../Apify.node';
import { createLoadOptionsFunctions, executeWorkflow } from './utils/executeWorkflow';
import { CredentialsHelper } from './utils/credentialHelper';
import { getRunTaskDataByNodeName, getTaskData } from './utils/getNodeResultData';
import getRunWorkflow from './workflows/actor-runs/get-run.workflow.json';
import getUserRunsListWorkflow from './workflows/actor-runs/get-user-runs-list.workflow.json';
import getRunsWorkflow from './workflows/actor-runs/get-runs.workflow.json';
import runActorAndGetDatasetWorkflow from './workflows/actors/run-actor-and-get-dataset.workflow.json';
import webFetchWorkflow from './workflows/actors/web-fetch.workflow.json';
import runTaskAndGetDatasetWorkflow from './workflows/actor-tasks/run-task-and-get-dataset.workflow.json';
import * as fixtures from './utils/fixtures';
import * as helpers from '../helpers';
import { getTaskArrayData } from './utils/getNodeResultData';

describe('Apify Node', () => {
	let apifyNode: Apify;
	let credentialsHelper: CredentialsHelper;

	beforeEach(() => {
		apifyNode = new Apify();
		credentialsHelper = new CredentialsHelper({
			apifyApi: {
				apiToken: 'test-token',
				baseUrl: 'https://api.apify.com',
			},
		});
	});

	describe('description', () => {
		it('should have a name property', () => {
			expect(apifyNode.description.name).toBeDefined();
			expect(apifyNode.description.name).toEqual('apify');
		});

		it('should have properties defined', () => {
			expect(apifyNode.description.properties).toBeDefined();
		});

		it('should have credential properties defined', () => {
			expect(apifyNode.description.credentials).toBeDefined();
		});

		it('should expose maxTotalChargeUsd on every operation that starts a run', () => {
			const maxCostProperties = apifyNode.description.properties.filter(
				(property) => property.name === 'maxTotalChargeUsd',
			);

			expect(
				maxCostProperties.map((property) => property.displayOptions?.show?.operation).flat(),
			).toEqual(
				expect.arrayContaining([
					'Run actor',
					'Run actor and get dataset',
					'Run task',
					'Run task and get dataset',
				]),
			);
			// unset must mean no limit
			maxCostProperties.forEach((property) => expect(property.default).toBeNull());
		});

		it('should default Actor input to JSON with optional schema fields on run-actor operations', () => {
			const operationsOf = (name: string) =>
				apifyNode.description.properties
					.filter((property) => property.name === name)
					.map((property) => property.displayOptions?.show?.operation)
					.flat();
			const runActorOperations = ['Run actor', 'Run actor and get dataset'];

			expect(operationsOf('actorInputMode')).toEqual(runActorOperations);
			expect(operationsOf('actorInput')).toEqual(runActorOperations);

			apifyNode.description.properties
				.filter((property) => property.name === 'actorInputMode')
				.forEach((property) => expect(property.default).toBe('json'));
			apifyNode.description.properties
				.filter((property) => property.name === 'actorInput')
				.forEach((property) => {
					expect(property.type).toBe('resourceMapper');
					// fields must follow the build the run will use
					expect(property.typeOptions?.loadOptionsDependsOn).toEqual(['actorId.value', 'build']);
					expect(property.displayOptions?.show?.actorInputMode).toEqual(['schema']);
				});
			apifyNode.description.properties
				.filter(
					(property) =>
						property.name === 'customBody' &&
						runActorOperations.includes(property.displayOptions?.show?.operation?.[0] as string),
				)
				.forEach((property) =>
					expect(property.displayOptions?.show?.actorInputMode).toEqual(['json']),
				);
		});
	});

	describe('actor input fields (resource mapper)', () => {
		const getActorInputFields = () =>
			apifyNode.methods!.resourceMapping!.getActorInputFields as (
				this: ILoadOptionsFunctions,
			) => Promise<ResourceMapperFields>;

		const createNode = (actorId: unknown) => ({
			name: 'Run actor',
			type: 'n8n-nodes-apify.apify',
			typeVersion: 2,
			parameters: {
				authentication: 'apifyApi',
				resource: 'Actors',
				operation: 'Run actor',
				actorId,
			},
		});

		const buildWithInputSchema = (input: object) => ({ data: { actorDefinition: { input } } });

		it('should ask to select an Actor when none is set, without calling the API', async () => {
			const context = createLoadOptionsFunctions({
				credentialsHelper,
				node: createNode({ __rl: true, mode: 'list', value: '' }),
			});

			const result = await getActorInputFields().call(context);

			expect(result.fields).toEqual([]);
			expect(result.emptyFieldsNotice).toMatch(/select an actor/i);
		});

		it("should map the default build's input schema to resource mapper fields", async () => {
			const scope = nock('https://api.apify.com')
				.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
				.reply(
					200,
					buildWithInputSchema({
						type: 'object',
						properties: {
							startUrls: {
								title: 'Start URLs',
								type: 'array',
								prefill: [{ url: 'https://apify.com' }],
							},
							maxPages: { title: 'Max pages', type: 'integer', prefill: 10 },
							proxy: { title: 'Proxy', type: 'object', prefill: { useApifyProxy: true } },
							saveHtml: { title: 'Save HTML', type: 'boolean', default: false },
							format: {
								title: 'Format',
								type: 'string',
								enum: ['md', 'txt'],
								enumTitles: ['Markdown', 'Text'],
							},
							query: { type: 'string' },
							mode: { title: 'Mode', type: 'string', default: 'fast' },
						},
						required: ['startUrls', 'query', 'mode'],
					}),
				);

			const context = createLoadOptionsFunctions({
				credentialsHelper,
				node: createNode({ __rl: true, mode: 'list', value: 'nFJndFXA5zjCTuudP' }),
			});

			const result = await getActorInputFields().call(context);

			const common = { defaultMatch: false, display: true };
			expect(result.fields).toEqual([
				{
					...common,
					id: 'startUrls',
					displayName: 'Start URLs',
					type: 'array',
					required: true,
					removed: false,
					defaultValue: JSON.stringify([{ url: 'https://apify.com' }], null, 2),
				},
				{
					...common,
					id: 'maxPages',
					displayName: 'Max pages',
					type: 'number',
					required: false,
					removed: false,
					defaultValue: 10,
				},
				{
					...common,
					id: 'proxy',
					displayName: 'Proxy',
					type: 'object',
					required: false,
					removed: false,
					defaultValue: JSON.stringify({ useApifyProxy: true }, null, 2),
				},
				{
					...common,
					id: 'saveHtml',
					displayName: 'Save HTML',
					type: 'boolean',
					required: false,
					removed: true,
				},
				{
					...common,
					id: 'format',
					displayName: 'Format',
					type: 'options',
					options: [
						{ name: 'Markdown', value: 'md' },
						{ name: 'Text', value: 'txt' },
					],
					required: false,
					removed: true,
				},
				// required without a schema default: n8n must ask for it
				{
					...common,
					id: 'query',
					displayName: 'query',
					type: 'string',
					required: true,
					removed: false,
				},
				// required but Apify applies the schema default, so it stays optional
				{
					...common,
					id: 'mode',
					displayName: 'Mode',
					type: 'string',
					required: false,
					removed: true,
				},
			]);
			expect(scope.isDone()).toBe(true);
		});

		it('should fall back to the stringified inputSchema of older builds', async () => {
			const scope = nock('https://api.apify.com')
				.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
				.reply(200, {
					data: {
						inputSchema: JSON.stringify({
							properties: { query: { title: 'Query', type: 'string', prefill: 'apify' } },
						}),
					},
				});

			const context = createLoadOptionsFunctions({
				credentialsHelper,
				node: createNode({ __rl: true, mode: 'id', value: 'nFJndFXA5zjCTuudP' }),
			});

			const result = await getActorInputFields().call(context);

			expect(result.fields.map((field) => [field.id, field.defaultValue])).toEqual([
				['query', 'apify'],
			]);
			expect(scope.isDone()).toBe(true);
		});

		it('should load the fields from the build selected by the build tag', async () => {
			const actor = fixtures.getActorResult();
			const { buildId } = actor.data.taggedBuilds.latest;
			const scope = nock('https://api.apify.com')
				.get('/v2/acts/nFJndFXA5zjCTuudP')
				.reply(200, actor)
				.get(`/v2/actor-builds/${buildId}`)
				.reply(
					200,
					buildWithInputSchema({
						properties: { query: { title: 'Query', type: 'string', prefill: 'tagged' } },
					}),
				);

			const node = createNode({ __rl: true, mode: 'list', value: 'nFJndFXA5zjCTuudP' });
			const context = createLoadOptionsFunctions({
				credentialsHelper,
				node: { ...node, parameters: { ...node.parameters, build: 'latest' } },
			});

			const result = await getActorInputFields().call(context);

			expect(result.fields.map((field) => [field.id, field.defaultValue])).toEqual([
				['query', 'tagged'],
			]);
			// the default build must not be used when a tag is set
			expect(scope.isDone()).toBe(true);
			expect(nock.pendingMocks()).toEqual([]);
		});

		// n8n's editor drops errors thrown by a resource mapper method, so failures must come back
		// as a notice - the only feedback shown with `supportAutoMap: false`.
		const expectLoadFailureNotice = (result: ResourceMapperFields, reason: string) => {
			expect(result.fields).toEqual([]);
			expect(result.emptyFieldsNotice).toContain("Could not load the Actor's input fields");
			expect(result.emptyFieldsNotice).toContain(reason);
			expect(result.emptyFieldsNotice).toMatch(/use JSON input/i);
		};

		it('should explain when the Actor has no default build (e.g. never built)', async () => {
			const scope = nock('https://api.apify.com')
				.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
				.reply(404, {
					error: { type: 'record-not-found', message: 'Actor build was not found' },
				});

			const context = createLoadOptionsFunctions({
				credentialsHelper,
				node: createNode({ __rl: true, mode: 'list', value: 'nFJndFXA5zjCTuudP' }),
			});

			const result = await getActorInputFields().call(context);

			expectLoadFailureNotice(result, 'Actor build was not found');
			expect(scope.isDone()).toBe(true);
		});

		it('should explain when the build tag does not exist', async () => {
			const scope = nock('https://api.apify.com')
				.get('/v2/acts/nFJndFXA5zjCTuudP')
				.reply(200, fixtures.getActorResult());

			const node = createNode({ __rl: true, mode: 'list', value: 'nFJndFXA5zjCTuudP' });
			const context = createLoadOptionsFunctions({
				credentialsHelper,
				node: { ...node, parameters: { ...node.parameters, build: 'beta' } },
			});

			const result = await getActorInputFields().call(context);

			expectLoadFailureNotice(result, "Build tag &#39;beta&#39; does not exist");
			expect(scope.isDone()).toBe(true);
		});

		it('should explain when the default build cannot be fetched', async () => {
			const scope = nock('https://api.apify.com')
				.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
				.reply(200, {});

			const context = createLoadOptionsFunctions({
				credentialsHelper,
				node: createNode({ __rl: true, mode: 'list', value: 'nFJndFXA5zjCTuudP' }),
			});

			const result = await getActorInputFields().call(context);

			expectLoadFailureNotice(result, 'Could not fetch default build for actor nFJndFXA5zjCTuudP');
			expect(scope.isDone()).toBe(true);
		});

		it('should explain when the input schema is not valid JSON', async () => {
			const scope = nock('https://api.apify.com')
				.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
				.reply(200, { data: { inputSchema: '{ not json' } });

			const context = createLoadOptionsFunctions({
				credentialsHelper,
				node: createNode({ __rl: true, mode: 'list', value: 'nFJndFXA5zjCTuudP' }),
			});

			const result = await getActorInputFields().call(context);

			expectLoadFailureNotice(result, 'Could not parse the input schema of actor nFJndFXA5zjCTuudP');
			expect(scope.isDone()).toBe(true);
		});

		it('should escape API error text, since the notice is rendered as HTML', async () => {
			const scope = nock('https://api.apify.com')
				.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
				.reply(404, { error: { type: 'record-not-found', message: '<img src=x onerror=alert(1)>' } });

			const context = createLoadOptionsFunctions({
				credentialsHelper,
				node: createNode({ __rl: true, mode: 'list', value: 'nFJndFXA5zjCTuudP' }),
			});

			const result = await getActorInputFields().call(context);

			expect(result.emptyFieldsNotice).not.toContain('<img');
			expect(result.emptyFieldsNotice).toContain('&lt;img src=x onerror=alert(1)&gt;');
			expect(scope.isDone()).toBe(true);
		});

		it('should point to JSON input when the Actor has no input schema', async () => {
			const scope = nock('https://api.apify.com')
				.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
				.reply(200, { data: {} });

			const context = createLoadOptionsFunctions({
				credentialsHelper,
				node: createNode({ __rl: true, mode: 'list', value: 'nFJndFXA5zjCTuudP' }),
			});

			const result = await getActorInputFields().call(context);

			expect(result.fields).toEqual([]);
			expect(result.emptyFieldsNotice).toMatch(/json/i);
			expect(scope.isDone()).toBe(true);
		});
	});

	describe('actor-runs', () => {
		describe('get-run', () => {
			it('should run the get-run workflow', async () => {
				const runId = 'c7Orwz5b830Tbp784';
				const mockRun = fixtures.getRunResult();

				const scope = nock('https://api.apify.com')
					.get(`/v2/actor-runs/${runId}`)
					.reply(200, mockRun);

				const { executionData } = await executeWorkflow({
					credentialsHelper,
					workflow: getRunWorkflow,
				});

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Get run');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskData(nodeResult);
				expect(data).toEqual(mockRun.data);

				expect(scope.isDone()).toBe(true);
			});
		});

		describe('get-runs', () => {
			it('should run the get-user-runs-list workflow', async () => {
				const mockRunsList = fixtures.getUserRunsListResult();

				const scope = nock('https://api.apify.com')
					.get('/v2/actor-runs')
					.query(true)
					.reply(200, mockRunsList);

				const { executionData } = await executeWorkflow({
					credentialsHelper,
					workflow: getUserRunsListWorkflow,
				});

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Get user runs list');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskArrayData(nodeResult);
				expect(Array.isArray(data)).toBe(true);
				expect(data?.map((item: { json: any; }) => item.json)).toEqual(mockRunsList.data.items);

				expect(scope.isDone()).toBe(true);
			});
		});

		describe('get-actor-runs', () => {
			it('should run the get-actor-runs workflow', async () => {
				const mockRunsList = fixtures.getActorRunsResult();

				const scope = nock('https://api.apify.com')
					.get('/v2/acts/nFJndFXA5zjCTuudP/runs')
					.query(true)
					.reply(200, mockRunsList);

				const { executionData } = await executeWorkflow({
					credentialsHelper,
					workflow: getRunsWorkflow,
				});

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Get runs');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskArrayData(nodeResult);
				expect(Array.isArray(data)).toBe(true);
				expect(data?.map((item: { json: any; }) => item.json)).toEqual(mockRunsList.data.items);

				expect(scope.isDone()).toBe(true);
			});
		});

		describe('abort-run', () => {
			it('should run the abort-run workflow', async () => {
				const runId = 'c7Orwz5b830Tbp784';
				const mockAbort = fixtures.abortRunResult();

				const scope = nock('https://api.apify.com')
					.post(`/v2/actor-runs/${runId}/abort`)
					.reply(200, mockAbort);

				const abortRunWorkflow = require('./workflows/actor-runs/abort-run.workflow.json');
				const { executionData } = await executeWorkflow({
					credentialsHelper,
					workflow: abortRunWorkflow,
				});

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Abort run');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskData(nodeResult);
				expect(data).toEqual(mockAbort.data);

				expect(scope.isDone()).toBe(true);
			});

			it('should pass gracefully=true as a query param when enabled', async () => {
				const runId = 'c7Orwz5b830Tbp784';
				const mockAbort = fixtures.abortRunResult();

				const scope = nock('https://api.apify.com')
					.post(`/v2/actor-runs/${runId}/abort`)
					.query({ gracefully: 'true' })
					.reply(200, mockAbort);

				const baseWorkflow = require('./workflows/actor-runs/abort-run.workflow.json');
				const workflow = {
					...baseWorkflow,
					nodes: baseWorkflow.nodes.map((node: any) =>
						node.name === 'Abort run'
							? { ...node, parameters: { ...node.parameters, gracefully: true } }
							: node,
					),
				};

				const { executionData } = await executeWorkflow({ credentialsHelper, workflow });

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Abort run');
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');
				expect(scope.isDone()).toBe(true);
			});
		});
	});

	describe('actor-tasks', () => {
		describe('run-task', () => {
			it('should run the run-task workflow (waitForFinish: false)', async () => {
				const mockRunTask = fixtures.runActorResult();

				const scope = nock('https://api.apify.com')
					.post('/v2/actor-tasks/PwUDLcG3zMyT8E4vq/runs')
					.query({ waitForFinish: 0, memory: 1024 })
					.reply(200, mockRunTask);

				const runTaskWorkflow = require('./workflows/actor-tasks/run-task.workflow.json');
				const { executionData } = await executeWorkflow({
					credentialsHelper,
					workflow: runTaskWorkflow,
				});

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Run task');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskData(nodeResult);
				expect(data).toEqual(mockRunTask.data);

				expect(scope.isDone()).toBe(true);
			});

			it('should pass maxTotalChargeUsd as a query param when set', async () => {
				const mockRunTask = fixtures.runActorResult();

				const scope = nock('https://api.apify.com')
					.post('/v2/actor-tasks/PwUDLcG3zMyT8E4vq/runs')
					.query({ waitForFinish: 0, memory: 1024, maxTotalChargeUsd: 5.5 })
					.reply(200, mockRunTask);

				const baseWorkflow = require('./workflows/actor-tasks/run-task.workflow.json');
				const workflow = {
					...baseWorkflow,
					nodes: baseWorkflow.nodes.map((node: any) =>
						node.name === 'Run task'
							? { ...node, parameters: { ...node.parameters, maxTotalChargeUsd: 5.5 } }
							: node,
					),
				};

				const { executionData } = await executeWorkflow({ credentialsHelper, workflow });

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Run task');
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');
				expect(scope.isDone()).toBe(true);
			});

			it('should omit maxTotalChargeUsd when it is 0, treating it as no limit', async () => {
				const mockRunTask = fixtures.runActorResult();

				const scope = nock('https://api.apify.com')
					.post('/v2/actor-tasks/PwUDLcG3zMyT8E4vq/runs')
					// nock matches the query exactly
					.query({ waitForFinish: 0, memory: 1024 })
					.reply(200, mockRunTask);

				const baseWorkflow = require('./workflows/actor-tasks/run-task.workflow.json');
				const workflow = {
					...baseWorkflow,
					nodes: baseWorkflow.nodes.map((node: any) =>
						node.name === 'Run task'
							? { ...node, parameters: { ...node.parameters, maxTotalChargeUsd: 0 } }
							: node,
					),
				};

				const { executionData } = await executeWorkflow({ credentialsHelper, workflow });

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Run task');
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');
				expect(scope.isDone()).toBe(true);
			});

			it('should run the run-task workflow and wait for finish (waitForFinish: true)', async () => {
				const mockRunTask = fixtures.runActorResult();
				const mockFinishedRun = fixtures.getRunTaskResult();

				const scope = nock('https://api.apify.com')
					.post('/v2/actor-tasks/PwUDLcG3zMyT8E4vq/runs')
					.query({ waitForFinish: 0, memory: 1024 })
					.reply(200, mockRunTask)
					.get(`/v2/actor-runs/${mockRunTask.data.id}`)
					.reply(200, mockFinishedRun);

				const runTaskWorkflow = require('./workflows/actor-tasks/run-task-wait-for-finish.workflow.json');
				const { executionData } = await executeWorkflow({
					credentialsHelper,
					workflow: runTaskWorkflow,
				});

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Run task');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskData(nodeResult);
				// expect polled terminal run as result
				expect(data).not.toEqual(mockRunTask.data);
				expect(data).toEqual(mockFinishedRun.data);

				expect(scope.isDone()).toBe(true);
			});
		});

		describe('run-task-and-get-dataset', () => {
			it('should run the run-task-and-get-dataset workflow', async () => {
				const mockRunTask = fixtures.runActorResult();
				const mockFinishedRun = fixtures.getSuccessRunResult();
				const mockItems = fixtures.getItemsResult();

				const datasetId = mockFinishedRun.data.defaultDatasetId;

				const scope = nock('https://api.apify.com')
					.post('/v2/actor-tasks/PwUDLcG3zMyT8E4vq/runs')
					.query({ waitForFinish: 0, memory: 1024 })
					.reply(200, mockRunTask)
					.get(`/v2/actor-runs/${mockRunTask.data.id}`)
					.reply(200, mockFinishedRun)
					.get(`/v2/datasets/${datasetId}/items`)
					.query({ format: 'json' })
					.reply(200, mockItems);

				const { executionData } = await executeWorkflow({
					credentialsHelper,
					workflow: runTaskAndGetDatasetWorkflow,
				});

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Run task and get dataset');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskArrayData(nodeResult);
				expect(Array.isArray(data)).toBe(true);
				expect(data?.map((item: { json: any; }) => item.json)).toEqual(mockItems);

				expect(scope.isDone()).toBe(true);
			});

			it('should throw if the run-task-and-get-dataset workflow ends with ABORTED status', async () => {
				const mockRunTask = fixtures.runActorResult();
				const mockAbortedRun = fixtures.getLastRunResult({ status: 'ABORTED' });

				const scope = nock('https://api.apify.com')
					.post('/v2/actor-tasks/PwUDLcG3zMyT8E4vq/runs')
					.query({ waitForFinish: 0, memory: 1024 })
					.reply(200, mockRunTask)
					.get(`/v2/actor-runs/${mockRunTask.data.id}`)
					.reply(200, mockAbortedRun);

				await expect(
					executeWorkflow({
						credentialsHelper,
						workflow: runTaskAndGetDatasetWorkflow,
					}),
				).rejects.toThrow(/Run .* did not finish with status SUCCEEDED. Run status: ABORTED/);

				expect(scope.isDone()).toBe(true);
			});
		});
	});

	describe('actors', () => {
		describe('get-last-run', () => {
			it('should run the get-last-run workflow', async () => {
				const mockLastRun = fixtures.getLastRunResult();

				const scope = nock('https://api.apify.com')
					.get('/v2/acts/nFJndFXA5zjCTuudP/runs/last')
					.query({ status: 'ABORTED' })
					.reply(200, mockLastRun);

				const getLastRunWorkflow = require('./workflows/actors/get-last-run.workflow.json');
				const { executionData } = await executeWorkflow({
					credentialsHelper,
					workflow: getLastRunWorkflow,
				});

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Get last run');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskData(nodeResult);
				expect(data).toEqual(mockLastRun.data);

				expect(scope.isDone()).toBe(true);
			});
		});
		describe('run-actor', () => {
			it('should run the run-actor workflow', async () => {
				const mockRunActor = fixtures.runActorResult();
				const mockBuild = fixtures.getBuildResult();

				const scope = nock('https://api.apify.com')
					.get('/v2/acts/nFJndFXA5zjCTuudP')
					.reply(200, fixtures.getActorResult())
					.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
					.reply(200, mockBuild)
					.post('/v2/acts/nFJndFXA5zjCTuudP/runs')
					.query({ waitForFinish: 0, build: mockBuild.data.buildNumber, memory: 1024 })
					.reply(200, mockRunActor);

				const runActorWorkflow = require('./workflows/actors/run-actor.workflow.json');
				const { executionData } = await executeWorkflow({
					credentialsHelper,
					workflow: runActorWorkflow,
				});

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Run actor');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskData(nodeResult);
				expect(data).toEqual(mockRunActor.data);

				expect(scope.isDone()).toBe(true);
			});

			it('should pass maxTotalChargeUsd as a query param when set', async () => {
				const mockRunActor = fixtures.runActorResult();
				const mockBuild = fixtures.getBuildResult();

				const scope = nock('https://api.apify.com')
					.get('/v2/acts/nFJndFXA5zjCTuudP')
					.reply(200, fixtures.getActorResult())
					.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
					.reply(200, mockBuild)
					.post('/v2/acts/nFJndFXA5zjCTuudP/runs')
					.query({
						waitForFinish: 0,
						build: mockBuild.data.buildNumber,
						memory: 1024,
						maxTotalChargeUsd: 5.5,
					})
					.reply(200, mockRunActor);

				const baseWorkflow = require('./workflows/actors/run-actor.workflow.json');
				const workflow = {
					...baseWorkflow,
					nodes: baseWorkflow.nodes.map((node: any) =>
						node.name === 'Run actor'
							? { ...node, parameters: { ...node.parameters, maxTotalChargeUsd: 5.5 } }
							: node,
					),
				};

				const { executionData } = await executeWorkflow({ credentialsHelper, workflow });

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Run actor');
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');
				expect(scope.isDone()).toBe(true);
			});

			it('should omit maxTotalChargeUsd when it is 0, treating it as no limit', async () => {
				const mockRunActor = fixtures.runActorResult();
				const mockBuild = fixtures.getBuildResult();

				const scope = nock('https://api.apify.com')
					.get('/v2/acts/nFJndFXA5zjCTuudP')
					.reply(200, fixtures.getActorResult())
					.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
					.reply(200, mockBuild)
					.post('/v2/acts/nFJndFXA5zjCTuudP/runs')
					// nock matches the query exactly
					.query({ waitForFinish: 0, build: mockBuild.data.buildNumber, memory: 1024 })
					.reply(200, mockRunActor);

				const baseWorkflow = require('./workflows/actors/run-actor.workflow.json');
				const workflow = {
					...baseWorkflow,
					nodes: baseWorkflow.nodes.map((node: any) =>
						node.name === 'Run actor'
							? { ...node, parameters: { ...node.parameters, maxTotalChargeUsd: 0 } }
							: node,
					),
				};

				const { executionData } = await executeWorkflow({ credentialsHelper, workflow });

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Run actor');
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');
				expect(scope.isDone()).toBe(true);
			});

			it('should send the schema field values as Actor input, omitting unset ones', async () => {
				const mockRunActor = fixtures.runActorResult();
				const mockBuild = fixtures.getBuildResult();

				const scope = nock('https://api.apify.com')
					.get('/v2/acts/nFJndFXA5zjCTuudP')
					.reply(200, fixtures.getActorResult())
					.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
					.reply(200, mockBuild)
					.post('/v2/acts/nFJndFXA5zjCTuudP/runs', {
						queries: 'javascript',
						resultsPerPage: 2,
						focusOnPaidAds: false,
						includeUnfilteredResults: [],
					})
					.query({ waitForFinish: 0, build: mockBuild.data.buildNumber, memory: 1024 })
					.reply(200, mockRunActor);

				const baseWorkflow = require('./workflows/actors/run-actor.workflow.json');
				const workflow = {
					...baseWorkflow,
					nodes: baseWorkflow.nodes.map((node: any) =>
						node.name === 'Run actor'
							? {
									...node,
									parameters: {
										...node.parameters,
										actorInputMode: 'schema',
										actorInput: {
											mappingMode: 'defineBelow',
											value: {
												queries: 'javascript',
												resultsPerPage: 2,
												focusOnPaidAds: false,
												includeUnfilteredResults: [],
												// e.g. expressions resolving to nothing: let the Actor's defaults apply
												maxPagesPerQuery: null,
												countryCode: '',
											},
										},
									},
								}
							: node,
					),
				};

				const { executionData } = await executeWorkflow({ credentialsHelper, workflow });

				const [nodeResult] = getRunTaskDataByNodeName(executionData, 'Run actor');
				expect(nodeResult.executionStatus).toBe('success');
				expect(scope.isDone()).toBe(true);
			});

			it('should run the run-actor workflow and wait for finish', async () => {
				const mockRunActor = fixtures.runActorResult();
				const mockBuild = fixtures.getBuildResult();
				const mockFinishedRun = fixtures.getSuccessRunResult();

				const scope = nock('https://api.apify.com')
					.get('/v2/acts/nFJndFXA5zjCTuudP')
					.reply(200, fixtures.getActorResult())
					.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
					.reply(200, mockBuild)
					.post('/v2/acts/nFJndFXA5zjCTuudP/runs')
					.query({ waitForFinish: 0, build: mockBuild.data.buildNumber, memory: 1024 })
					.reply(200, mockRunActor)
					.get('/v2/actor-runs/Icz6E0IHX0c40yEi7')
					.reply(200, mockFinishedRun);

				const runActorWorkflow = require('./workflows/actors/run-actor-wait-for-finish.workflow.json');
				const { executionData } = await executeWorkflow({
					credentialsHelper,
					workflow: runActorWorkflow,
				});

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Run actor');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskData(nodeResult);
				// exptect polled terminal run as result
				expect(data).not.toEqual(mockRunActor.data);
				expect(data).toEqual(mockFinishedRun.data);

				expect(scope.isDone()).toBe(true);
			});

			it('should surface the approval link when running an unapproved full-permission actor', async () => {
				const mockBuild = fixtures.getBuildResult();
				const approvalUrl =
					'https://console.apify.com/actors/nFJndFXA5zjCTuudP?approvePermissions=true';

				const scope = nock('https://api.apify.com')
					.get('/v2/acts/nFJndFXA5zjCTuudP')
					.reply(200, fixtures.getActorResult())
					.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
					.reply(200, mockBuild)
					.post('/v2/acts/nFJndFXA5zjCTuudP/runs')
					.query({ waitForFinish: 0, build: mockBuild.data.buildNumber, memory: 1024 })
					.reply(403, {
						error: {
							type: 'full-permission-actor-not-approved',
							message: `This Actor requires full access to your account. You must approve its permissions before running it: ${approvalUrl}`,
							data: { approvalUrl },
						},
					});

				const runActorWorkflow = require('./workflows/actors/run-actor.workflow.json');

				let thrown: any;
				try {
					await executeWorkflow({ credentialsHelper, workflow: runActorWorkflow });
				} catch (error) {
					thrown = error;
				}

				expect(thrown).toBeDefined();
				expect(thrown.message).toContain('You must approve its permissions');
				expect(thrown.message).toContain('See the approval link in the node output');
				expect(thrown.message).not.toContain(approvalUrl);
				// Output description: the clickable approval link.
				expect(thrown.description).toContain(`href="${approvalUrl}"`);

				expect(scope.isDone()).toBe(true);
			});

			it('should not embed an unsafe approval URL in the error description', async () => {
				const mockBuild = fixtures.getBuildResult();
				// eslint-disable-next-line no-script-url
				const approvalUrl = 'javascript:alert(1)//" onmouseover="alert(2)';

				const scope = nock('https://api.apify.com')
					.get('/v2/acts/nFJndFXA5zjCTuudP')
					.reply(200, fixtures.getActorResult())
					.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
					.reply(200, mockBuild)
					.post('/v2/acts/nFJndFXA5zjCTuudP/runs')
					.query({ waitForFinish: 0, build: mockBuild.data.buildNumber, memory: 1024 })
					.reply(403, {
						error: {
							type: 'full-permission-actor-not-approved',
							message: `This Actor requires full access to your account. You must approve its permissions before running it: ${approvalUrl}`,
							data: { approvalUrl },
						},
					});

				const runActorWorkflow = require('./workflows/actors/run-actor.workflow.json');

				let thrown: any;
				try {
					await executeWorkflow({ credentialsHelper, workflow: runActorWorkflow });
				} catch (error) {
					thrown = error;
				}

				expect(thrown).toBeDefined();
				expect(thrown.message).toContain('You must approve its permissions');
				// The unsafe URL is dropped entirely, so no link is rendered anywhere.
				expect(thrown.message).not.toContain('javascript:');
				expect(thrown.message).not.toContain('onmouseover');
				expect(thrown.description).toBeUndefined();

				expect(scope.isDone()).toBe(true);
			});

			it('should give an AI tool a plain-text approval link n8n will not rewrite', async () => {
				const mockBuild = fixtures.getBuildResult();
				const approvalUrl =
					'https://console.apify.com/actors/nFJndFXA5zjCTuudP?approvePermissions=true';

				const scope = nock('https://api.apify.com')
					.get('/v2/acts/nFJndFXA5zjCTuudP')
					.reply(200, fixtures.getActorResult())
					.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
					.reply(200, mockBuild)
					.post('/v2/acts/nFJndFXA5zjCTuudP/runs')
					.query({ waitForFinish: 0, build: mockBuild.data.buildNumber, memory: 1024 })
					.reply(403, {
						error: {
							type: 'full-permission-actor-not-approved',
							message: `This Actor requires full access to your account. You must approve its permissions before running it: ${approvalUrl}`,
							data: { approvalUrl },
						},
					});

				// Same workflow, but the node runs under the `…Tool` type, as an AI Agent tool.
				const runActorWorkflow = JSON.parse(
					JSON.stringify(require('./workflows/actors/run-actor.workflow.json')),
				);
				runActorWorkflow.nodes[0].type = 'n8n-nodes-apify.apifyTool';

				let thrown: any;
				try {
					await executeWorkflow({ credentialsHelper, workflow: runActorWorkflow });
				} catch (error) {
					thrown = error;
				}

				expect(thrown).toBeDefined();
				// The agent reads `message`, so it carries the instruction; the bare URL goes in
				// `description`, which n8n appends for the agent and renders under the title.
				expect(thrown.message).toContain('You must approve its permissions');
				expect(thrown.message).toContain("Approve this Actor's permissions, then run it again");
				expect(thrown.message).not.toContain('node output');
				expect(thrown.description).toBe(approvalUrl);

				// A `message` containing the URL would hit n8n's `EPERM` rewrite (`approvePermissions`).
				expect(thrown.message).not.toContain(approvalUrl);
				expect(thrown.message.toUpperCase()).not.toContain('EPERM');
				expect(thrown.message).not.toContain('Operation not permitted');

				// Replay n8n's node-as-tool wrap + merge to check what the agent ends up with.
				const wrapped: any = new NodeOperationError(thrown.node, thrown);
				const agentText = wrapped.message.includes(wrapped.description)
					? wrapped.message
					: `${wrapped.message}\n\nDetails: ${wrapped.description}`;
				expect(agentText).toContain('You must approve its permissions');
				expect(agentText).toContain(approvalUrl);
				expect(agentText).not.toContain('Operation not permitted');

				expect(scope.isDone()).toBe(true);
			});
		});
		describe('run-actor-and-get-dataset', () => {
			it('should run the run-actor-and-get-dataset workflow', async () => {
				const mockRunActor = fixtures.runActorResult();
				const mockBuild = fixtures.getBuildResult();
				const mockFinishedRun = fixtures.getSuccessRunResult();
				const mockItems = fixtures.getItemsResult();

				const datasetId = mockFinishedRun.data.defaultDatasetId;

				const scope = nock('https://api.apify.com')
					.get('/v2/acts/nFJndFXA5zjCTuudP')
					.reply(200, fixtures.getActorResult())
					.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
					.reply(200, mockBuild)
					.post('/v2/acts/nFJndFXA5zjCTuudP/runs')
					.query({ waitForFinish: 0, build: mockBuild.data.buildNumber, memory: 1024 })
					.reply(200, mockRunActor)
					.get(`/v2/actor-runs/${mockRunActor.data.id}`)
					.reply(200, mockFinishedRun)
					.get(`/v2/datasets/${datasetId}/items`)
					.query({ format: 'json' })
					.reply(200, mockItems);

				const { executionData } = await executeWorkflow({
					credentialsHelper,
					workflow: runActorAndGetDatasetWorkflow,
				});

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Run actor and get dataset');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskArrayData(nodeResult);
				expect(Array.isArray(data)).toBe(true);
				expect(data?.map((item: { json: any; }) => item.json)).toEqual(mockItems);

				expect(scope.isDone()).toBe(true);
			});

			it('should send the schema field values as Actor input', async () => {
				const mockRunActor = fixtures.runActorResult();
				const mockBuild = fixtures.getBuildResult();
				const mockFinishedRun = fixtures.getSuccessRunResult();
				const mockItems = fixtures.getItemsResult();

				const scope = nock('https://api.apify.com')
					.get('/v2/acts/nFJndFXA5zjCTuudP')
					.reply(200, fixtures.getActorResult())
					.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
					.reply(200, mockBuild)
					.post('/v2/acts/nFJndFXA5zjCTuudP/runs', { queries: 'javascript' })
					.query({ waitForFinish: 0, build: mockBuild.data.buildNumber, memory: 1024 })
					.reply(200, mockRunActor)
					.get(`/v2/actor-runs/${mockRunActor.data.id}`)
					.reply(200, mockFinishedRun)
					.get(`/v2/datasets/${mockFinishedRun.data.defaultDatasetId}/items`)
					.query({ format: 'json' })
					.reply(200, mockItems);

				const workflow = {
					...runActorAndGetDatasetWorkflow,
					nodes: runActorAndGetDatasetWorkflow.nodes.map((node: any) =>
						node.name === 'Run actor and get dataset'
							? {
									...node,
									parameters: {
										...node.parameters,
										actorInputMode: 'schema',
										actorInput: { mappingMode: 'defineBelow', value: { queries: 'javascript' } },
									},
								}
							: node,
					),
				};

				const { executionData } = await executeWorkflow({ credentialsHelper, workflow });

				const [nodeResult] = getRunTaskDataByNodeName(executionData, 'Run actor and get dataset');
				expect(nodeResult.executionStatus).toBe('success');
				expect(scope.isDone()).toBe(true);
			});

			it('should throw if the run-actor-and-get-dataset workflow ends with ABORTED status', async () => {
				const mockRunActor = fixtures.runActorResult();
				const mockBuild = fixtures.getBuildResult();
				const mockAbortedRun = fixtures.getLastRunResult({ status: 'ABORTED' });

				const scope = nock('https://api.apify.com')
					.get('/v2/acts/nFJndFXA5zjCTuudP')
					.reply(200, fixtures.getActorResult())
					.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
					.reply(200, mockBuild)
					.post('/v2/acts/nFJndFXA5zjCTuudP/runs')
					.query({ waitForFinish: 0, build: mockBuild.data.buildNumber, memory: 1024 })
					.reply(200, mockRunActor)
					.get(`/v2/actor-runs/${mockRunActor.data.id}`)
					.reply(200, mockAbortedRun);

				await expect(
					executeWorkflow({
						credentialsHelper,
						workflow: runActorAndGetDatasetWorkflow,
					}),
				).rejects.toThrow(/Run .* did not finish with status SUCCEEDED. Run status: ABORTED/);

				expect(scope.isDone()).toBe(true);
			});
		});

		describe('scrape-single-url', () => {
			it('should run the scrape-single-url workflow', async () => {
				const mockRunActor = fixtures.runActorResult();
				const mockFinishedRun = fixtures.getSuccessRunResult();
				const mockItems = fixtures.getScrapeSingleUrlItemsResult();

				const datasetId = mockFinishedRun.data.defaultDatasetId;

				const scope = nock('https://api.apify.com')
					.post(`/v2/acts/${helpers.consts.WEB_CONTENT_SCRAPER_ACTOR_ID}/runs`)
					.query({ waitForFinish: 0 })
					.reply(200, mockRunActor)
					.get(`/v2/actor-runs/${mockRunActor.data.id}`)
					.reply(200, mockFinishedRun)
					.get(`/v2/datasets/${datasetId}/items`)
					.query({ format: 'json' })
					.reply(200, mockItems);

				const scrapeSingleUrlWorkflow = require('./workflows/actors/scrape-single-url.workflow.json');
				const { executionData } = await executeWorkflow({
					credentialsHelper,
					workflow: scrapeSingleUrlWorkflow,
				});

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Scrape single URL');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskData(nodeResult);
				expect(typeof data).toBe('object');
				// Default output format is markdown; other content formats are stripped.
				const { text, html, markdown, ...metadata } = mockItems[0];
				expect(data).toEqual({ ...metadata, markdown });

				expect(scope.isDone()).toBe(true);
			});

			it('should return metadata with only the selected output format (html)', async () => {
				const mockRunActor = fixtures.runActorResult();
				const mockFinishedRun = fixtures.getSuccessRunResult();
				const mockItems = fixtures.getScrapeSingleUrlItemsResult();

				const datasetId = mockFinishedRun.data.defaultDatasetId;

				const scope = nock('https://api.apify.com')
					.post(`/v2/acts/${helpers.consts.WEB_CONTENT_SCRAPER_ACTOR_ID}/runs`)
					.query({ waitForFinish: 0 })
					.reply(200, mockRunActor)
					.get(`/v2/actor-runs/${mockRunActor.data.id}`)
					.reply(200, mockFinishedRun)
					.get(`/v2/datasets/${datasetId}/items`)
					.query({ format: 'json' })
					.reply(200, mockItems);

				const baseWorkflow = require('./workflows/actors/scrape-single-url.workflow.json');
				const workflow = {
					...baseWorkflow,
					nodes: baseWorkflow.nodes.map((node: any) =>
						node.name === 'Scrape single URL'
							? { ...node, parameters: { ...node.parameters, outputFormat: 'html' } }
							: node,
					),
				};

				const { executionData } = await executeWorkflow({ credentialsHelper, workflow });

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Scrape single URL');
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskData(nodeResult);
				// Metadata plus only the selected (html) content format - no markdown/text.
				const { text, html, markdown, ...metadata } = mockItems[0];
				expect(data).toEqual({ ...metadata, html });

				expect(scope.isDone()).toBe(true);
			});

			it('should return metadata with only the selected output format (text)', async () => {
				const mockRunActor = fixtures.runActorResult();
				const mockFinishedRun = fixtures.getSuccessRunResult();
				const mockItems = fixtures.getScrapeSingleUrlItemsResult();

				const datasetId = mockFinishedRun.data.defaultDatasetId;

				const scope = nock('https://api.apify.com')
					.post(`/v2/acts/${helpers.consts.WEB_CONTENT_SCRAPER_ACTOR_ID}/runs`)
					.query({ waitForFinish: 0 })
					.reply(200, mockRunActor)
					.get(`/v2/actor-runs/${mockRunActor.data.id}`)
					.reply(200, mockFinishedRun)
					.get(`/v2/datasets/${datasetId}/items`)
					.query({ format: 'json' })
					.reply(200, mockItems);

				const baseWorkflow = require('./workflows/actors/scrape-single-url.workflow.json');
				const workflow = {
					...baseWorkflow,
					nodes: baseWorkflow.nodes.map((node: any) =>
						node.name === 'Scrape single URL'
							? { ...node, parameters: { ...node.parameters, outputFormat: 'text' } }
							: node,
					),
				};

				const { executionData } = await executeWorkflow({ credentialsHelper, workflow });

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Scrape single URL');
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskData(nodeResult);
				// text has no saveText actor input flag - it relies on the scraper
				// returning every content field. Other formats are still stripped.
				const { text, html, markdown, ...metadata } = mockItems[0];
				expect(data).toEqual({ ...metadata, text });

				expect(scope.isDone()).toBe(true);
			});

			it('should throw a clear error when the scraper returns no dataset items', async () => {
				const mockRunActor = fixtures.runActorResult();
				const mockFinishedRun = fixtures.getSuccessRunResult();
				const datasetId = mockFinishedRun.data.defaultDatasetId;

				const scope = nock('https://api.apify.com')
					.post(`/v2/acts/${helpers.consts.WEB_CONTENT_SCRAPER_ACTOR_ID}/runs`)
					.query({ waitForFinish: 0 })
					.reply(200, mockRunActor)
					.get(`/v2/actor-runs/${mockRunActor.data.id}`)
					.reply(200, mockFinishedRun)
					.get(`/v2/datasets/${datasetId}/items`)
					.query({ format: 'json' })
					.reply(200, []);

				const scrapeSingleUrlWorkflow = require('./workflows/actors/scrape-single-url.workflow.json');

				await expect(
					executeWorkflow({
						credentialsHelper,
						workflow: scrapeSingleUrlWorkflow,
					}),
				).rejects.toThrow(/No content was scraped/);

				expect(scope.isDone()).toBe(true);
			});

			it('should reject an obviously invalid URL before calling the API', async () => {
				const baseWorkflow = require('./workflows/actors/scrape-single-url.workflow.json');
				const makeWorkflowWithUrl = (url: string) => ({
					...baseWorkflow,
					nodes: baseWorkflow.nodes.map((node: any) =>
						node.name === 'Scrape single URL'
							? { ...node, parameters: { ...node.parameters, url } }
							: node,
					),
				});

				for (const badUrl of ['https://bla', 'https://-.com', 'not-a-url', 'ftp://example.com']) {
					await expect(
						executeWorkflow({
							credentialsHelper,
							workflow: makeWorkflowWithUrl(badUrl),
						}),
					).rejects.toThrow(/Invalid URL/);
				}
			});
		});

		describe('web-fetch', () => {
			// The apify/web-fetch Actor's standby endpoint (consts.WEB_FETCH_STANDBY_URL).
			const WEB_FETCH_HOST = 'https://web-fetch.apify.actor';

			// Spread the shared fixture and override the Web Fetch node's parameters,
			// mirroring the scrape-single-url overrides above.
			const makeWorkflow = (overrides: Record<string, any>) => ({
				...webFetchWorkflow,
				nodes: webFetchWorkflow.nodes.map((node: any) =>
					node.name === 'Web Fetch'
						? { ...node, parameters: { ...node.parameters, ...overrides } }
						: node,
				),
			});

			it('should run the web-fetch workflow (default formats = markdown)', async () => {
				const scope = nock(WEB_FETCH_HOST).post('/').reply(200, fixtures.getWebFetchResult());

				const { executionData } = await executeWorkflow({
					credentialsHelper,
					workflow: webFetchWorkflow,
				});

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Web Fetch');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskData(nodeResult);
				// The stub injects `headers`/`body` onto any non-/items response, so match
				// the fixture as a subset rather than asserting strict equality.
				expect(data).toMatchObject(fixtures.getWebFetchResult());

				expect(scope.isDone()).toBe(true);
			});

			it('should POST the url and the selected formats', async () => {
				let capturedBody: any;
				const scope = nock(WEB_FETCH_HOST)
					.post('/', (body) => {
						capturedBody = body;
						return true;
					})
					.reply(200, fixtures.getWebFetchResult());

				const workflow = makeWorkflow({ formats: ['markdown', 'html'] });
				const { executionData } = await executeWorkflow({ credentialsHelper, workflow });

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Web Fetch');
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				expect(capturedBody.url).toBe('https://docs.apify.com/academy/web-scraping-for-beginners');
				expect(capturedBody.formats).toEqual(['markdown', 'html']);

				expect(scope.isDone()).toBe(true);
			});

			it('should forward custom JSON headers when provided', async () => {
				let capturedBody: any;
				const scope = nock(WEB_FETCH_HOST)
					.post('/', (body) => {
						capturedBody = body;
						return true;
					})
					.reply(200, fixtures.getWebFetchResult());

				const workflow = makeWorkflow({ headers: '{"Accept-Language":"fr-FR"}' });
				const { executionData } = await executeWorkflow({ credentialsHelper, workflow });

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Web Fetch');
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				expect(capturedBody.headers).toEqual({ 'Accept-Language': 'fr-FR' });

				expect(scope.isDone()).toBe(true);
			});

			it('should omit the headers key when none are provided (default {})', async () => {
				let capturedBody: any;
				const scope = nock(WEB_FETCH_HOST)
					.post('/', (body) => {
						capturedBody = body;
						return true;
					})
					.reply(200, fixtures.getWebFetchResult());

				// The base workflow sets no `headers`, so the handler default `'{}'` applies.
				const { executionData } = await executeWorkflow({
					credentialsHelper,
					workflow: webFetchWorkflow,
				});

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Web Fetch');
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				expect(capturedBody).not.toHaveProperty('headers');

				expect(scope.isDone()).toBe(true);
			});

			it('should reject un-parseable headers before calling the API', async () => {
				const workflow = makeWorkflow({ headers: '{not json}' });

				await expect(executeWorkflow({ credentialsHelper, workflow })).rejects.toThrow(
					/Invalid Headers/,
				);
			});

			it('should reject non-object headers (array) from AI tool calls', async () => {
				await expect(
					executeWorkflow({
						credentialsHelper,
						workflow: makeWorkflow({ headers: [1, 2, 3] }),
					}),
				).rejects.toThrow(/Invalid Headers/);
			});

			it('should reject non-object headers (number) from AI tool calls', async () => {
				await expect(
					executeWorkflow({
						credentialsHelper,
						workflow: makeWorkflow({ headers: 42 }),
					}),
				).rejects.toThrow(/Invalid Headers/);
			});

			it('should reject an obviously invalid URL before calling the API', async () => {
				for (const badUrl of ['https://bla', 'not-a-url', 'ftp://example.com']) {
					await expect(
						executeWorkflow({ credentialsHelper, workflow: makeWorkflow({ url: badUrl }) }),
					).rejects.toThrow(/Invalid URL/);
				}
			});

			// The two error-envelope cases below are the coverage the reviewer
			// specifically called out on web-fetch/execute.ts.
			it('should map the flat { code, error } error envelope to a NodeApiError', async () => {
				const scope = nock(WEB_FETCH_HOST)
					.post('/')
					.reply(400, { code: 'BAD_REQUEST', error: 'Something failed' });

				let thrown: any;
				try {
					await executeWorkflow({ credentialsHelper, workflow: webFetchWorkflow });
				} catch (error) {
					thrown = error;
				}

				expect(thrown).toBeDefined();
				expect(thrown.message).toContain('Something failed');
				expect(thrown.description).toContain('Web Fetch error code: BAD_REQUEST');

				expect(scope.isDone()).toBe(true);
			});

			it('should map the nested { error: { message, type } } error envelope to a NodeApiError', async () => {
				const scope = nock(WEB_FETCH_HOST)
					.post('/')
					.reply(401, { error: { message: 'Unauthorized', type: 'auth' } });

				let thrown: any;
				try {
					await executeWorkflow({ credentialsHelper, workflow: webFetchWorkflow });
				} catch (error) {
					thrown = error;
				}

				expect(thrown).toBeDefined();
				expect(thrown.message).toContain('Unauthorized');
				expect(thrown.description).toContain('Web Fetch error type: auth');

				expect(scope.isDone()).toBe(true);
			});
		});
	});

	describe('datasets', () => {
		describe('get-items', () => {
			it('should run the get-items workflow', async () => {
				const mockItems = fixtures.getItemsResult();
				const datasetId = 'WkzbQMuFYuamGv3YF';

				const scope = nock('https://api.apify.com')
					.get(`/v2/datasets/${datasetId}/items`)
					.query(true)
					.reply(200, mockItems);

				const getItemsWorkflow = require('./workflows/datasets/get-items.workflow.json');
				const { executionData } = await executeWorkflow({
					credentialsHelper,
					workflow: getItemsWorkflow,
				});

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Get items');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskArrayData(nodeResult);
				expect(Array.isArray(data)).toBe(true);
				expect(data?.map((item: { json: any; }) => item.json)).toEqual(mockItems);

				expect(scope.isDone()).toBe(true);
			});
		});
	});

	describe('key-value-stores', () => {
		describe('get-key-value-store-record', () => {
			it('should run the get-key-value-store-record workflow', async () => {
				const mockRecord = fixtures.getKeyValueStoreRecordResult();
				const storeId = 'yTfMu13hDFe9bRjx6';
				const recordKey = 'INPUT';

				const scope = nock('https://api.apify.com')
					.get(`/v2/key-value-stores/${storeId}/records/${recordKey}`)
					.reply(200, mockRecord);

				const getKeyValueStoreRecordWorkflow = require('./workflows/key-value-stores/get-key-value-store-record.workflow.json');
				const { executionData } = await executeWorkflow({
					credentialsHelper,
					workflow: getKeyValueStoreRecordWorkflow,
				});

				const nodeResults = getRunTaskDataByNodeName(executionData, 'Get Key-Value Store Record');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskData(nodeResult);
				expect(data).toEqual({
					storeId,
					recordKey,
					contentType: expect.any(String),
					data: mockRecord,
				});

				expect(scope.isDone()).toBe(true);
			});
		});
	});

	describe('api calls', () => {
		it('should retry the specified number of times with exponential delays', async () => {
			const storeId = 'yTfMu13hDFe9bRjx6';
			const recordKey = 'INPUT';

			const scope = nock('https://api.apify.com')
				.get(`/v2/key-value-stores/${storeId}/records/${recordKey}`)
				.reply(500)
				.get(`/v2/key-value-stores/${storeId}/records/${recordKey}`)
				.reply(429)
				.get(`/v2/key-value-stores/${storeId}/records/${recordKey}`)
				.reply(200);

			const getKeyValueStoreRecordWorkflow = require('./workflows/key-value-stores/get-key-value-store-record.workflow.json');
			await executeWorkflow({
				credentialsHelper,
				workflow: getKeyValueStoreRecordWorkflow,
			});

			expect(scope.isDone()).toBe(true);
		});
	});
});
