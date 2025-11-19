import {
	ICredentialsHelper,
	IExecuteFunctions,
	IExecuteSingleFunctions,
	INodeExecutionData,
	IRun,
	ITaskData,
} from 'n8n-workflow';
import { nodeTypes } from './nodeTypesClass';
import { IGetNodeParameterOptions } from 'n8n-workflow';
import axios from 'axios';

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
        // Make an actual HTTP request that nock can intercept
        try {
            const response = await axios({
                method: options.method || 'GET',
                url: options.url,
                params: options.qs,
                data: options.body,
                headers: options.headers,
            });

						// For /items endpoint just return data
						if (options.url.includes('/items'))
							return response.data;

						// Build a return object compatible with the n8n node
						return {
							...response.data,
							headers: response.headers,
							body: JSON.stringify(response.data) // Needed by key-value tests
						}
        } catch (error: any) {
            // Re-throw with the same structure as n8n would
            if (error.response) {
                const err = new Error(error.response.statusText || 'Request failed');
                (err as any).httpCode = error.status;
                (err as any).response = {
                    body: error.response.data,
                    statusCode: error.response.status,
                };
                throw err;
            }
            throw error;
        }
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
