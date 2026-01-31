import { IExecuteFunctions, NodeApiError, NodeOperationError } from 'n8n-workflow';
import { apiRequest, customBodyParser, pollRunStatus } from './genericFunctions';

export interface ActorExecutionParams {
	actorId: string;
	timeout: number | null;
	memory: number | null;
	buildParam: string | null;
	rawStringifiedInput: string | object;
	waitForFinish?: boolean;
}

export interface ActorExecutionResult {
	runId: string;
	lastRunData: any;
}

export async function executeActor(
	this: IExecuteFunctions,
	params: ActorExecutionParams,
): Promise<ActorExecutionResult> {
	const {
		actorId,
		timeout,
		memory,
		buildParam,
		rawStringifiedInput,
		waitForFinish = false,
	} = params;

	let userInput: any;
	try {
		userInput = customBodyParser(rawStringifiedInput);
	} catch {
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

	// 3. Prepare query string
	const qs: Record<string, any> = {};
	if (timeout != null) qs.timeout = timeout;
	if (memory != null) qs.memory = memory;
	if (build?.buildNumber) qs.build = build.buildNumber;
	qs.waitForFinish = 0; // set initial run actor to not wait for finish

	// 4. Run the actor
	const run = await runActorApi.call(this, actorId, userInput, qs);
	if (!run?.data?.id) {
		throw new NodeApiError(this.getNode(), {
			message: `Run ID not found after running the actor`,
		});
	}

	const runId = run.data.id;
	let lastRunData = run.data;

	// 5. If waitForFinish is true, poll for run status until it reaches a terminal state
	if (waitForFinish) {
		lastRunData = await pollRunStatus.call(this, runId);
	}

	return {
		runId,
		lastRunData,
	};
}

export async function getBuildByTag(
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

export async function getDefaultBuild(this: IExecuteFunctions, actorId: string) {
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

export async function runActorApi(
	this: IExecuteFunctions,
	actorId: string,
	mergedInput: any,
	qs: any,
) {
	return await apiRequest.call(this, {
		method: 'POST',
		uri: `/v2/acts/${actorId}/runs`,
		body: mergedInput,
		qs,
	});
}
