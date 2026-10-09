import {
	FieldType,
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeParameterResourceLocator,
	INodePropertyOptions,
	ResourceMapperField,
	NodeOperationError,
	ResourceMapperFields,
} from 'n8n-workflow';
import { getDefaultBuild } from './executeActor';

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

function getEnumOptions(property: ActorInputSchemaProperty): INodePropertyOptions[] {
	return (property.enum ?? [])
		.filter(
			(value): value is string | number | boolean =>
				typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean',
		)
		.map((value, index) => ({ name: property.enumTitles?.[index] ?? String(value), value }));
}

function getFieldType(property: ActorInputSchemaProperty): FieldType {
	switch (property.type) {
		case 'boolean':
			return 'boolean';
		case 'integer':
		case 'number':
			return 'number';
		case 'array':
			return 'array';
		case 'object':
			return 'object';
		default:
			return 'string';
	}
}

function mapPropertyToField(
	id: string,
	property: ActorInputSchemaProperty,
	isRequired: boolean,
): ResourceMapperField {
	const options = getEnumOptions(property);
	const hasPrefill = property.prefill !== undefined && property.prefill !== null;
	// Apify fills in schema defaults itself, so only required inputs without one must be set here.
	const required = isRequired && property.default === undefined;

	const field: ResourceMapperField = {
		id,
		displayName: property.title || id,
		defaultMatch: false,
		required,
		display: true,
		type: options.length > 0 ? 'options' : getFieldType(property),
		// Show what the Apify Console would prefill; everything else can be added on demand.
		removed: !hasPrefill && !required,
	};
	if (options.length > 0) field.options = options;
	if (hasPrefill) {
		// Object and array fields are edited as JSON, so their default must be a JSON string.
		field.defaultValue =
			typeof property.prefill === 'object'
				? JSON.stringify(property.prefill, null, 2)
				: (property.prefill as string | number | boolean);
	}
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
			`Could not parse the input schema of actor ${actorId}`,
		);
	}
}

/**
 * Loads the input schema of the selected Actor's default build as resource mapper fields,
 * pre-filled with the values the Apify Console would prefill.
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
	const build = (await getDefaultBuild.call(this, actorId)) as ActorBuild;
	const schema = getInputSchema.call(this, actorId, build);

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

	// Reading `.value` makes n8n validate the fields and parse JSON strings of object/array fields.
	const values = this.getNodeParameter('actorInput.value', i, {}) as IDataObject | null;
	// Leave unset fields out so the Actor's own defaults apply.
	return Object.fromEntries(
		Object.entries(values ?? {}).filter(
			([, value]) => value !== null && value !== undefined && value !== '',
		),
	);
}
