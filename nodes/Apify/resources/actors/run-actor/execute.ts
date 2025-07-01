import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { apiRequest } from '../../genericFunctions';
import * as helpers from '../../../helpers';

export async function runActor(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
	const actorId = this.getNodeParameter('actorId', i, undefined, {
		extractValue: true,
	}) as string;
	const timeout = this.getNodeParameter('timeout', i) as number | null;
	const memory = this.getNodeParameter('memory', i) as number | null;
	const buildParam = this.getNodeParameter('build', i) as string | null;
	const waitForFinish = this.getNodeParameter('waitForFinish', i) as boolean;
	const rawStringifiedInput = this.getNodeParameter('customBody', i, '{}') as string;

	let userInput: any;
	try {
		userInput = rawStringifiedInput ? JSON.parse(rawStringifiedInput) : {};
	} catch (err) {
		throw new NodeOperationError(
			this.getNode(),
			`Could not parse custom body: ${rawStringifiedInput}`,
		);
	}

	if (!actorId) {
		throw new NodeOperationError(this.getNode(), 'Actor ID is required');
	}

	// 1. Get the actor details
	const actor = await apiRequest.call(this, {
		method: 'GET',
		uri: `/v2/acts/${actorId}`,
	});
	if (!actor || !actor.data) {
		throw new NodeApiError(this.getNode(), {
			message: `Actor ${actorId} not found`,
		});
	}
	const actorData = actor.data;

	// 2. Build selection logic
	let build: any;
	if (buildParam) {
		build = await getBuildByTag.call(this, actorId, buildParam, actorData);
	} else {
		build = await getDefaultBuild.call(this, actorId);
	}

	// 3. Get default input for this build
	const defaultInput = getDefaultInputsFromBuild(build);

	// 4. Merge default input and user's input (user's input overrides)
	const mergedInput = { ...defaultInput, ...userInput };

	// 5. Prepare query string
	const qs: Record<string, any> = {};
	if (timeout != null) qs.timeout = timeout;
	if (memory != null) qs.memory = memory;
	if (build?.buildTag) qs.build = build.buildTag;
	qs.waitForFinish = 0; // set initial run actor to not wait for finish

	// 6. Run the actor
	const run = await runActorApi.call(this, actorId, mergedInput, qs);
	if (!run?.data?.id) {
		throw new NodeApiError(this.getNode(), {
			message: `Run ID not found after running the actor`,
		});
	}

	// 7a. If waitForFinish is false, return the run data immediately
	if (!waitForFinish) {
		return {
			json: { ...run.data },
		};
	}

	// 7b. Start polling for run status until it reaches a terminal state
	// This loop is infinite and will only stop when a terminal status is reached,
	// or when the workflow maximum timeout is hit, as set in your n8n configuration.
	const runId = run.data.id;
	let lastRunData = run.data;
	while (true) {
		try {
			const pollResult = await apiRequest.call(this, {
				method: 'GET',
				uri: `/v2/actor-runs/${runId}`,
			});
			const status = pollResult?.data?.status;
			lastRunData = pollResult?.data;
			if (helpers.consts.TERMINAL_RUN_STATUSES.includes(status)) {
				break;
			}
		} catch (err) {
			throw new NodeApiError(this.getNode(), {
				message: `Error polling run status: ${err}`,
			});
		}
		await new Promise((resolve) =>
			setTimeout(resolve, helpers.consts.WAIT_FOR_FINISH_POLL_INTERVAL),
		);
	}
	return {
		json: { ...lastRunData },
	};
}

async function getBuildByTag(
	this: IExecuteFunctions,
	actorId: string,
	buildTag: string,
	actorData: any,
) {
	const buildByTag = actorData.taggedBuilds && actorData.taggedBuilds[buildTag];
	if (!buildByTag?.buildId) {
		throw new NodeApiError(this.getNode(), {
			message: `Build tag '${buildTag}' does not exist for actor ${actorData.title ?? actorData.name ?? actorId}`,
		});
	}
	const buildResp = await apiRequest.call(this, {
		method: 'GET',
		uri: `/v2/actor-builds/${buildByTag.buildId}`,
	});
	if (!buildResp || !buildResp.data) {
		throw new NodeApiError(this.getNode(), {
			message: `Build with ID '${buildByTag.buildId}' not found for actor ${actorId}`,
		});
	}
	return buildResp.data;
}

async function getDefaultBuild(this: IExecuteFunctions, actorId: string) {
	const defaultBuildResp = await apiRequest.call(this, {
		method: 'GET',
		uri: `/v2/acts/${actorId}/builds/default`,
	});
	if (!defaultBuildResp || !defaultBuildResp.data) {
		throw new NodeApiError(this.getNode(), {
			message: `Could not fetch default build for actor ${actorId}`,
		});
	}
	return defaultBuildResp.data;
}

function getDefaultInputsFromBuild(build: any) {
	const buildInputProperties = build?.actorDefinition?.input?.properties;
	const defaultInput: Record<string, any> = {};
	if (buildInputProperties && typeof buildInputProperties === 'object') {
		for (const [key, property] of Object.entries(buildInputProperties)) {
			if (
				property &&
				typeof property === 'object' &&
				'prefill' in property &&
				(property as any).prefill !== undefined &&
				(property as any).prefill !== null
			) {
				defaultInput[key] = (property as any).prefill;
			}
		}
	}
	return defaultInput;
}

async function runActorApi(this: IExecuteFunctions, actorId: string, mergedInput: any, qs: any) {
	return await apiRequest.call(this, {
		method: 'POST',
		uri: `/v2/acts/${actorId}/runs`,
		body: mergedInput,
		qs,
	});
}
