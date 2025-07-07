import { Apify } from '../Apify.node';
import { executeWorkflow } from './utils/executeWorkflow';
import { CredentialsHelper } from './utils/credentialHelper';
import { getRunTaskDataByNodeName, getTaskArrayData, getTaskData } from './utils/getNodeResultData';
import getRunWorkflow from './workflows/actor-runs/get-run.workflow.json';
import nock from 'nock';
import getUserRunsListWorkflow from './workflows/actor-runs/get-user-runs-list.workflow.json';
import * as fixtures from './utils/fixtures';
import * as helpers from '../helpers';

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
	});

	describe('actor-runs', () => {
		describe('get-run', () => {
			it('should run the get-run workflow', async () => {
				const runId = 'c7Orwz5b830Tbp784';
				const mockRun = fixtures.getRunResult();

				const scope = nock('https://api.apify.com')
					.get(`/v2/actor-runs/${runId}`)
					.reply(200, mockRun);

				const { waitPromise } = await executeWorkflow({
					credentialsHelper,
					workflow: getRunWorkflow,
				});
				const result = await waitPromise.promise();

				const nodeResults = getRunTaskDataByNodeName(result, 'Get run');
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

				const { waitPromise } = await executeWorkflow({
					credentialsHelper,
					workflow: getUserRunsListWorkflow,
				});
				const result = await waitPromise.promise();

				const nodeResults = getRunTaskDataByNodeName(result, 'Get user runs list');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskArrayData(nodeResult);
				expect(Array.isArray(data)).toBe(true);
				expect(data?.map((item) => item.json)).toEqual(mockRunsList.data.items);

				expect(scope.isDone()).toBe(true);
			});
		});
	});

	describe('actor-tasks', () => {
		describe('run-task', () => {
			it('should run the run-task workflow', async () => {
				const mockRunTask = fixtures.getRunTaskResult();

				const scope = nock('https://api.apify.com')
					.post('/v2/actor-tasks/PwUDLcG3zMyT8E4vq/runs')
					.query(true)
					.reply(200, mockRunTask);

				const runTaskWorkflow = require('./workflows/actor-tasks/run-task.workflow.json');
				const { waitPromise } = await executeWorkflow({
					credentialsHelper,
					workflow: runTaskWorkflow,
				});
				const result = await waitPromise.promise();

				const nodeResults = getRunTaskDataByNodeName(result, 'Run task');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskData(nodeResult);
				expect(data).toEqual(mockRunTask.data);

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
				const { waitPromise } = await executeWorkflow({
					credentialsHelper,
					workflow: getLastRunWorkflow,
				});
				const result = await waitPromise.promise();

				const nodeResults = getRunTaskDataByNodeName(result, 'Get last run');
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

				const scope = nock('https://api.apify.com')
					.get('/v2/acts/nFJndFXA5zjCTuudP')
					.reply(200, fixtures.getActorResult())
					.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
					.reply(200, fixtures.getBuildResult())
					.post('/v2/acts/nFJndFXA5zjCTuudP/runs')
					.query({ waitForFinish: 0 })
					.reply(200, mockRunActor);

				const runActorWorkflow = require('./workflows/actors/run-actor.workflow.json');
				const { waitPromise } = await executeWorkflow({
					credentialsHelper,
					workflow: runActorWorkflow,
				});
				const result = await waitPromise.promise();

				const nodeResults = getRunTaskDataByNodeName(result, 'Run actor');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskData(nodeResult);
				expect(data).toEqual(mockRunActor.data);

				expect(scope.isDone()).toBe(true);
			});

			it('should run the run-actor workflow and wait for finish', async () => {
				const mockRunActor = fixtures.runActorResult();
				const mockFinishedRun = fixtures.getRunResult();

				const scope = nock('https://api.apify.com')
					.get('/v2/acts/nFJndFXA5zjCTuudP')
					.reply(200, fixtures.getActorResult())
					.get('/v2/acts/nFJndFXA5zjCTuudP/builds/default')
					.reply(200, fixtures.getBuildResult())
					.post('/v2/acts/nFJndFXA5zjCTuudP/runs')
					.query({ waitForFinish: 0 })
					.reply(200, mockRunActor)
					.get('/v2/actor-runs/Icz6E0IHX0c40yEi7')
					.reply(200, mockFinishedRun);

				const runActorWorkflow = require('./workflows/actors/run-actor-wait-for-finish.workflow.json');
				const { waitPromise } = await executeWorkflow({
					credentialsHelper,
					workflow: runActorWorkflow,
				});
				const result = await waitPromise.promise();

				const nodeResults = getRunTaskDataByNodeName(result, 'Run actor');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskData(nodeResult);
				// exptect polled terminal run as result
				expect(data).not.toEqual(mockRunActor.data);
				expect(data).toEqual(mockFinishedRun.data);

				expect(scope.isDone()).toBe(true);
			});
		});
		describe('scrape-single-url', () => {
			it('should run the scrape-single-url workflow', async () => {
				const mockRunResponse = fixtures.runScrapeSingleUrlActorResult();
				const mockItems = fixtures.getScrapeSingleUrlItemsResult();

				const datasetId = mockRunResponse.data.defaultDatasetId;

				const scope = nock('https://api.apify.com')
					.post(`/v2/acts/${helpers.consts.WEB_CONTENT_SCRAPER_ACTOR_ID}/runs`)
					.query({ waitForFinish: 60 })
					.reply(200, mockRunResponse)
					.get(`/v2/datasets/${datasetId}/items`)
					.query({ format: 'json' })
					.reply(200, mockItems);

				const scrapeSingleUrlWorkflow = require('./workflows/actors/scrape-single-url.workflow.json');
				const { waitPromise } = await executeWorkflow({
					credentialsHelper,
					workflow: scrapeSingleUrlWorkflow,
				});
				const result = await waitPromise.promise();

				const nodeResults = getRunTaskDataByNodeName(result, 'Scrape single URL');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskData(nodeResult);
				expect(typeof data).toBe('object');
				expect(data).toEqual(mockItems[0]);

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
				const { waitPromise } = await executeWorkflow({
					credentialsHelper,
					workflow: getItemsWorkflow,
				});
				const result = await waitPromise.promise();

				const nodeResults = getRunTaskDataByNodeName(result, 'Get items');
				expect(nodeResults.length).toBe(1);
				const [nodeResult] = nodeResults;
				expect(nodeResult.executionStatus).toBe('success');

				const data = getTaskArrayData(nodeResult);
				expect(Array.isArray(data)).toBe(true);
				expect(data?.map((item) => item.json)).toEqual(mockItems);

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
				const { waitPromise } = await executeWorkflow({
					credentialsHelper,
					workflow: getKeyValueStoreRecordWorkflow,
				});
				const result = await waitPromise.promise();

				const nodeResults = getRunTaskDataByNodeName(result, 'Get Key-Value Store Record');
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
});
