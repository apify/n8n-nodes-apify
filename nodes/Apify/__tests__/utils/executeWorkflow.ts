import {
	ICredentialsHelper,
	IExecuteFunctions,
	IExecuteSingleFunctions,
	INodeExecutionData,
	IRun,
	ITaskData,
} from 'n8n-workflow';
import { nodeTypes } from './nodeTypesClass';
import * as fixtures from './fixtures';
import { IGetNodeParameterOptions } from 'n8n-workflow';

export type ExecuteWorkflowArgs = {
	workflow: any;
	credentialsHelper: ICredentialsHelper;
};

export const executeWorkflow = async ({
	credentialsHelper,
	workflow: workflowJson,
}: ExecuteWorkflowArgs): Promise<{ executionData: IRun }> => {
	// Pick the first node (your crawler)
	const [node] = workflowJson.nodes;

	// Minimal fake executeFunctions
	const fakeExecuteFunctions = {
		getCredentials: async (name: string) => {
			return credentialsHelper.getDecrypted({} as any, { name } as any, name, 'manual');
		},
		getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any, options?: IGetNodeParameterOptions) => {
			if (options?.extractValue)
				return node.parameters[parameterName].value;
			return node.parameters[parameterName];
		},
		getInputData: (): INodeExecutionData[] => {
			// Provide at least one empty item so loops like `for (let i = 0; i < items.length; i++)`
			// still work
			return [{ json: {} }];
		},
		continueOnFail: () => {
			return false;
		},
		getNode: () => {
			return node;
		},
		helpers: {
			httpRequestWithAuthentication: async function (
				this: IExecuteFunctions,
				_credentialType: string,
				options: any,
			) {
				const url = options.url as string;
				const urlParts = url.split('/');
				console.log(`url ${JSON.stringify(url)}`)

				if (url.includes('/builds/default')) {
					return fixtures.getBuildResult();
				}
				if (url.includes('/acts')) {
					if (url.includes('/runs')) {
						const actId = urlParts?.[urlParts.length - 2];
						if (actId === 'nFJndFXA5zjCTuudP')
							return fixtures.getActorRunsResult();

						return fixtures.runActorResult();
					}
				}
				if (url.includes('/actor-runs')) {
					const runId = urlParts[urlParts.length - 1];

					if (runId === 'c7Orwz5b830Tbp784')
						return fixtures.getRunResult();
					if (runId === 'Icz6E0IHX0c40yEi7')
						return fixtures.getRunTaskResult();

					return fixtures.getUserRunsListResult();
				}
				if (url.includes('/actors/')) {
					return fixtures.getActorResult();
				}
				if (url.includes('/actor-tasks')) {
					const taskId = urlParts?.[urlParts.length - 2]
					if (taskId === 'PwUDLcG3zMyT8E4vq')
						return fixtures.runActorResult();
					if (taskId === 'PwUDLcG3zMyT8E4vq')
						return fixtures.runActorResult();
				}
				if (url.includes('/datasets')) {
					const datasetId = urlParts?.[urlParts.length - 2];

					if (datasetId === 'c2FdVlC9kJuPexhYo')
						return fixtures.getItemsResult();
				}

				throw new Error(`Unhandled request in fixture stub: ${url}`);
			},
			returnJsonArray: (items: any[]) => {
				return items.map((i) => ({ json: i }));
			},
			constructExecutionMetaData: (inputData: any, _options: any) => {
				return inputData;
			},
		},
	} as unknown as IExecuteFunctions & IExecuteSingleFunctions;

	// Run the node directly
	const nodeType = nodeTypes.getByNameAndVersion(node.type, node.typeVersion);
	if (!('execute' in nodeType) || typeof nodeType.execute !== 'function') {
		throw new Error(`Node ${node.type} has no execute() method`);
	}
	const result = await (nodeType.execute as Function).call(fakeExecuteFunctions);

	// Build fake ITaskData
	const taskData: ITaskData = {
		startTime: Date.now(),
		executionTime: 1,
		executionStatus: 'success',
		data: { main: result as any },
		source: [
			{
				previousNode: '',
			},
		],
	};

	// Wrap in fake IRun-like structure
	const executionData: IRun = {
		mode: 'manual',
		status: 'success',
		data: {
			resultData: {
				runData: {
					[node.name]: [taskData],
				},
			},
		},
		finished: true,
		startedAt: new Date(),
		stoppedAt: new Date(),
	};

	return { executionData };
};
