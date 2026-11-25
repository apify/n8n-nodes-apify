import { INodePropertyOptions, ResourceMapperField } from 'n8n-workflow';
import { HTTP_METHODS } from '../helpers/consts';
import { escapeHtml, getFieldTypeAndOptions, toFieldDefaultValue } from './genericFunctions';

/**
 * Pure helpers that read a Server Actor's OpenAPI document (`actorDefinition.webServerSchema`
 * of its default build): the endpoint options, each endpoint's operation, and its typed resource
 * mapper fields. No n8n context or HTTP here, so everything is unit-testable.
 */

type JsonObject = Record<string, unknown>;

// Paths Actors expose for the platform or for docs, not for callers.
const HIDDEN_PATHS = new Set([
	'/health',
	'/healthz',
	'/openapi.json',
	'/openapi.yaml',
	'/docs',
	'/favicon.ico',
	'/robots.txt',
	'/mcp',
	'/sse',
]);

// At most this many `$ref`s are followed in a chain, and a ref that repeats in its own chain (a
// cycle) becomes `{}`. Plain nesting isn't limited, so deep schemas aren't cut short.
const MAX_REF_DEPTH = 10;

// Id of the single field used when the request body isn't an object with properties. Other
// field ids are where the value goes and its name, such as `query:limit`.
const WHOLE_BODY_FIELD_ID = 'body';

export interface OpenApiParameter {
	name: string;
	in: string;
	required?: boolean;
	style?: string;
	explode?: boolean;
	schema?: JsonObject;
}

function isObject(value: unknown): value is JsonObject {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Parses `webServerSchema`, which the API returns as an object or, for some builds, a JSON string. */
export function parseOpenApiDocument(schema: unknown): JsonObject | undefined {
	if (isObject(schema)) return schema;
	if (typeof schema !== 'string') return undefined;
	try {
		const parsed = JSON.parse(schema);
		return isObject(parsed) ? parsed : undefined;
	} catch {
		return undefined;
	}
}

/** Resolves a local JSON pointer such as `#/components/schemas/FetchRequest/properties/url`. */
function resolvePointer(document: JsonObject, ref: string): unknown {
	if (!ref.startsWith('#/')) return undefined;
	return ref
		.slice(2)
		.split('/')
		.map((part) => decodeURIComponent(part).replace(/~1/g, '/').replace(/~0/g, '~'))
		.reduce<unknown>((node, key) => (isObject(node) ? node[key] : undefined), document);
}

/**
 * Returns `node` with its local `$ref`s resolved. Unresolvable or remote refs become `{}`. Each
 * ref is resolved once per call and its result shared, so the work stays proportional to the
 * document: without that, a small document whose schemas each reference the next one many times
 * would expand into billions of nodes and freeze n8n.
 */
export function resolveRefs(
	document: JsonObject,
	node: unknown,
	refs: string[] = [],
	resolved = new Map<string, unknown>(),
): unknown {
	if (Array.isArray(node)) return node.map((item) => resolveRefs(document, item, refs, resolved));
	if (!isObject(node)) return node;
	if (typeof node.$ref === 'string') {
		const ref = node.$ref;
		if (refs.length >= MAX_REF_DEPTH || refs.includes(ref)) return {};
		if (!resolved.has(ref)) {
			const target = resolvePointer(document, ref);
			resolved.set(
				ref,
				target === undefined ? {} : resolveRefs(document, target, [...refs, ref], resolved),
			);
		}
		return resolved.get(ref);
	}
	return Object.fromEntries(
		Object.entries(node).map(([key, value]) => [key, resolveRefs(document, value, refs, resolved)]),
	);
}

/** Turns an OpenAPI document into endpoint options with values like `POST /search`. */
export function parseOpenApiEndpoints(document: JsonObject | undefined): INodePropertyOptions[] {
	const paths = document?.paths;
	if (!isObject(paths)) return [];

	const endpoints: INodePropertyOptions[] = [];
	for (const [path, pathItem] of Object.entries(paths)) {
		if (HIDDEN_PATHS.has(path) || !isObject(pathItem)) continue;
		for (const method of HTTP_METHODS) {
			const operation = pathItem[method.toLowerCase()];
			if (!isObject(operation)) continue;
			const value = `${method} ${path}`;
			const summary = operation.summary || operation.description;
			endpoints.push({
				name: value,
				value,
				// n8n renders option descriptions as HTML, and the Actor's author controls this text.
				...(typeof summary === 'string' && summary ? { description: escapeHtml(summary) } : {}),
			});
		}
	}
	return endpoints;
}

/** Splits an endpoint value like `POST /items/{id}` into its method and path. */
export function parseEndpointValue(value: string): { method: string; path: string } | undefined {
	const match = /^([A-Z]+) (\/\S*)$/.exec(value.trim());
	if (!match || !(HTTP_METHODS as string[]).includes(match[1])) return undefined;
	return { method: match[1], path: match[2] };
}

interface EndpointOperation {
	parameters: OpenApiParameter[];
	bodySchema?: JsonObject;
	bodyRequired: boolean;
}

/** Finds the operation for an endpoint, with path-level and operation-level parameters merged. */
export function getEndpointOperation(
	document: JsonObject | undefined,
	method: string,
	path: string,
): EndpointOperation | undefined {
	const paths = document?.paths;
	if (!document || !isObject(paths)) return undefined;
	const pathItem = resolveRefs(document, paths[path]);
	if (!isObject(pathItem)) return undefined;
	const operation = pathItem[method.toLowerCase()];
	if (!isObject(operation)) return undefined;

	// Operation-level parameters override path-level ones with the same name and location.
	const parameters = new Map<string, OpenApiParameter>();
	for (const list of [pathItem.parameters, operation.parameters]) {
		if (!Array.isArray(list)) continue;
		for (const parameter of list) {
			if (!isObject(parameter) || typeof parameter.name !== 'string') continue;
			if (typeof parameter.in !== 'string') continue;
			parameters.set(`${parameter.in}:${parameter.name}`, parameter as unknown as OpenApiParameter);
		}
	}

	const requestBody = isObject(operation.requestBody) ? operation.requestBody : undefined;
	const content = isObject(requestBody?.content) ? requestBody.content : {};
	const jsonContentType = Object.keys(content).find((type) => /[/+]json\b/i.test(type));
	const jsonContent = jsonContentType ? content[jsonContentType] : undefined;
	const bodySchema =
		isObject(jsonContent) && isObject(jsonContent.schema) ? jsonContent.schema : undefined;

	return {
		parameters: [...parameters.values()],
		bodySchema,
		bodyRequired: requestBody?.required === true,
	};
}

/**
 * The schema a field takes its type from. Pydantic and FastAPI write an optional value as
 * `anyOf: [<schema>, { type: 'null' }]` or `type: [<type>, 'null']`, and older Pydantic wraps a
 * single `$ref` in `allOf`. With exactly one non-null branch, that branch gives the type, and the
 * wrapper's own keywords, such as `default`, win. A value must match every `allOf` branch, so
 * branches that extend a base schema give their one shared type. Unions of several types are
 * left as they are, so their fields stay text.
 */
function unwrapSchema(schema: unknown): JsonObject | undefined {
	if (!isObject(schema)) return undefined;
	let result = schema;
	for (const keyword of ['anyOf', 'oneOf', 'allOf']) {
		const branches = result[keyword];
		if (!Array.isArray(branches)) continue;
		const nonNull = branches.filter((branch) => !(isObject(branch) && branch.type === 'null'));
		if (nonNull.length === 1 && isObject(nonNull[0])) {
			const wrapper = { ...result };
			delete wrapper[keyword];
			result = { ...nonNull[0], ...wrapper };
		} else if (keyword === 'allOf' && result.type === undefined) {
			const types = new Set(
				nonNull.map((branch) => (isObject(branch) ? withoutNull(branch.type) : undefined)),
			);
			types.delete(undefined);
			if (types.size === 1) result = { ...result, type: [...types][0] };
		}
	}
	const type = withoutNull(result.type);
	return type === result.type ? result : { ...result, type };
}

/** A `type` list such as `['integer', 'null']` as its one non-null type; anything else as is. */
function withoutNull(type: unknown): unknown {
	if (!Array.isArray(type)) return type;
	const types = type.filter((entry) => entry !== 'null');
	return types.length === 1 ? types[0] : type;
}

/** Names of an operation's array query parameters that are sent comma-separated (`explode: false`). */
export function getNonExplodedQueryParams(parameters: OpenApiParameter[]): Set<string> {
	return new Set(
		parameters
			.filter((parameter) => parameter.in === 'query' && parameter.explode === false)
			.map((parameter) => parameter.name),
	);
}

function toField(
	id: string,
	displayName: string,
	schema: JsonObject | undefined,
	required: boolean,
): ResourceMapperField {
	const defaultValue = toFieldDefaultValue(schema?.default);
	const field: ResourceMapperField = {
		id,
		displayName,
		defaultMatch: false,
		required,
		display: true,
		...getFieldTypeAndOptions(schema),
		// Prefill the Actor's own default, so adding a field doesn't change what it gets.
		// Without one, n8n leaves the field empty (booleans start as false).
		...(defaultValue !== undefined ? { defaultValue } : {}),
		// Show what must be filled in. The rest can be added from the list, and the server
		// applies its own defaults to what's left out.
		removed: !required,
	};
	// n8n's number input stores 0 as soon as the field is added, and that 0 would be sent in
	// place of the Actor's own default. Without a default to prefill, take the number as text,
	// which stays empty until filled in; the node converts it back (see `FieldTarget.isNumber`).
	if (field.type === 'number' && typeof defaultValue !== 'number') field.type = 'string';
	return field;
}

/** Where a field's value goes in the request. */
export interface FieldTarget {
	location: 'path' | 'query' | 'body' | 'wholeBody';
	/** The parameter's or body property's name. */
	name: string;
	/** The schema is a number, so the value may be the number as text. */
	isNumber: boolean;
}

interface FieldEntry extends FieldTarget {
	field: ResourceMapperField;
}

function toEntry(
	location: 'path' | 'query' | 'body',
	name: string,
	schema: JsonObject | undefined,
	required: boolean,
): FieldEntry {
	return {
		location,
		name,
		isNumber: schema?.type === 'integer' || schema?.type === 'number',
		field: toField(`${location}:${name}`, name, schema, required),
	};
}

function getFieldEntries(
	document: JsonObject | undefined,
	method: string,
	path: string,
): FieldEntry[] | undefined {
	const operation = getEndpointOperation(document, method, path);
	if (!document || !operation) return undefined;

	// A placeholder such as `{itemId}` needs a value even when the document doesn't declare it.
	const declared = new Set(
		operation.parameters.filter((parameter) => parameter.in === 'path').map(({ name }) => name),
	);
	const undeclared = [...path.matchAll(/\{([^}]+)\}/g)]
		.map(([, name]) => name)
		.filter((name) => !declared.has(name))
		.map((name): OpenApiParameter => ({ name, in: 'path' }));

	const entries: FieldEntry[] = [];
	for (const parameter of [...undeclared, ...operation.parameters]) {
		if (parameter.in !== 'path' && parameter.in !== 'query') continue;
		const schema = unwrapSchema(resolveRefs(document, parameter.schema));
		const required = parameter.in === 'path' || parameter.required === true;
		entries.push(toEntry(parameter.in, parameter.name, schema, required));
	}

	if (method !== 'GET' && operation.bodySchema) {
		const bodySchema = unwrapSchema(resolveRefs(document, operation.bodySchema)) ?? {};
		const properties = isObject(bodySchema.properties) ? bodySchema.properties : undefined;
		if (properties && Object.keys(properties).length > 0) {
			const requiredNames = new Set(Array.isArray(bodySchema.required) ? bodySchema.required : []);
			for (const [name, schema] of Object.entries(properties)) {
				entries.push(toEntry('body', name, unwrapSchema(schema), requiredNames.has(name)));
			}
		} else {
			const field = toField(WHOLE_BODY_FIELD_ID, 'Body (JSON)', bodySchema, operation.bodyRequired);
			// A body without a usable schema is edited as JSON either way.
			if (field.type !== 'array') field.type = 'object';
			delete field.options;
			entries.push({ location: 'wholeBody', name: WHOLE_BODY_FIELD_ID, isNumber: false, field });
		}
	}
	return entries;
}

/**
 * Builds typed fields for an endpoint: path and query parameters, then the JSON body's
 * top-level properties. A body that isn't an object with properties becomes one JSON field.
 */
export function getEndpointFields(
	document: JsonObject | undefined,
	method: string,
	path: string,
): ResourceMapperField[] | undefined {
	const entries = getFieldEntries(document, method, path);
	if (!entries) return undefined;
	// Add the location to a label only when two parameters or body properties share a name.
	const nameCounts = new Map<string, number>();
	for (const { location, name } of entries) {
		if (location !== 'wholeBody') nameCounts.set(name, (nameCounts.get(name) ?? 0) + 1);
	}
	return entries.map(({ location, name, field }) =>
		location !== 'wholeBody' && (nameCounts.get(name) ?? 0) > 1
			? { ...field, displayName: `${name} (${location})` }
			: field,
	);
}

/** Where each of the endpoint's field values goes in the request, by field id. */
export function getEndpointFieldTargets(
	document: JsonObject | undefined,
	method: string,
	path: string,
): Map<string, FieldTarget> {
	return new Map(
		(getFieldEntries(document, method, path) ?? []).map(({ field, ...target }) => [
			field.id,
			target,
		]),
	);
}
