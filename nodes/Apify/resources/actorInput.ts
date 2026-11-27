import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeParameterResourceLocator,
	NodeApiError,
	ResourceMapperField,
	NodeOperationError,
	ResourceMapperFields,
} from 'n8n-workflow';
import { getBuildByTag, getDefaultBuild } from './executeActor';
import {
	apiRequest,
	escapeHtml,
	getErrorReason,
	getFieldTypeAndOptions,
	getResourceMapperValues,
	toFieldDefaultValue,
} from './genericFunctions';

interface ActorInputSchemaProperty {
	title?: string;
	type?: string;
	enum?: unknown[];
	enumTitles?: string[];
	prefill?: unknown;
	default?: unknown;
}

interface ActorInputSchema {
	properties?: Record<string, ActorInputSchemaProperty>;
	required?: string[];
}

interface ActorBuild {
	actorDefinition?: { input?: ActorInputSchema };
	inputSchema?: string;
}

function mapPropertyToField(
	id: string,
	property: ActorInputSchemaProperty,
	isRequired: boolean,
): ResourceMapperField {
	const prefill = toFieldDefaultValue(property.prefill);
	// Apify fills in schema defaults itself, so only required inputs without one must be set here.
	const required = isRequired && property.default === undefined;

	const field: ResourceMapperField = {
		id,
		displayName: property.title || id,
		defaultMatch: false,
		required,
		display: true,
		...getFieldTypeAndOptions(property),
		// Show what the Apify Console would prefill; everything else can be added on demand.
		removed: prefill === undefined && !required,
	};
	if (prefill !== undefined) field.defaultValue = prefill;
	return field;
}

function getInputSchema(
	this: ILoadOptionsFunctions,
	actorId: string,
	build: ActorBuild,
): ActorInputSchema | undefined {
	if (build.actorDefinition?.input) return build.actorDefinition.input;
	if (!build.inputSchema) return undefined;
	// Older builds expose the input schema only as a JSON string.
	try {
		return JSON.parse(build.inputSchema) as ActorInputSchema;
	} catch {
		throw new NodeOperationError(
			this.getNode(),
			`Could not parse the input schema of Actor ${actorId}`,
		);
	}
}

/** Resolves the build the same way `executeActor` does, so the fields match the run. */
async function getBuild(this: ILoadOptionsFunctions, actorId: string) {
	const buildTag = this.getNodeParameter('build', '') as string;
	if (!buildTag) return await getDefaultBuild.call(this, actorId);

	const actor = await apiRequest.call(this, { method: 'GET', uri: `/v2/acts/${actorId}` });
	if (!actor?.data) {
		throw new NodeApiError(this.getNode(), { message: `Actor ${actorId} not found` });
	}
	return await getBuildByTag.call(this, actorId, buildTag, actor.data);
}

/**
 * Loads the input schema of the build the run will use (the `build` tag, else the default build)
 * as resource mapper fields, pre-filled with the values the Apify Console would prefill.
 */
export async function getActorInputFields(
	this: ILoadOptionsFunctions,
): Promise<ResourceMapperFields> {
	const actorLocator = this.getNodeParameter(
		'actorId',
		null,
	) as INodeParameterResourceLocator | null;
	// An expression that can't be resolved at design time (e.g. `$fromAI()`) arrives empty too.
	if (!actorLocator?.value) {
		return {
			fields: [],
			emptyFieldsNotice:
				'Select an Actor from the list, by URL or by ID to load its input fields. If the Actor is set by an expression, use JSON input instead.',
		};
	}

	const actorId = this.getNodeParameter('actorId', '', { extractValue: true }) as string;
	let schema: ActorInputSchema | undefined;
	try {
		const build = (await getBuild.call(this, actorId)) as ActorBuild;
		schema = getInputSchema.call(this, actorId, build);
	} catch (error) {
		// n8n's editor drops errors thrown here and, with `supportAutoMap: false`, shows nothing,
		// so return the reason as a notice instead. The notice is rendered as HTML.
		return {
			fields: [],
			emptyFieldsNotice: `Could not load the Actor's input fields: ${escapeHtml(getErrorReason(error))}. Make sure the Actor has a successful build in Apify Console, or use JSON input instead.`,
		};
	}

	const requiredIds = new Set(schema?.required ?? []);
	const fields = Object.entries(schema?.properties ?? {}).map(([id, property]) =>
		mapPropertyToField(id, property, requiredIds.has(id)),
	);

	if (fields.length === 0) {
		return {
			fields: [],
			emptyFieldsNotice: 'This Actor has no input schema. Use JSON input instead.',
		};
	}
	return { fields };
}

/**
 * Returns the Actor input for item `i`: the raw JSON body by default, or the schema field
 * values when the input mode is `schema`.
 */
export function getActorInput(this: IExecuteFunctions, i: number): string | object {
	const inputMode = this.getNodeParameter('actorInputMode', i, 'json') as string;
	if (inputMode !== 'schema') {
		return this.getNodeParameter('customBody', i, '{}') as string | object;
	}

	// n8n already prunes fields the user cleared; an explicit '' (e.g. from an expression) is sent
	// to override a default.
	return getResourceMapperValues.call(this, 'actorInput', i);
}
