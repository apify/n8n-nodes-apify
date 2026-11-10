import { FieldType, INodePropertyOptions, ResourceMapperField } from 'n8n-workflow';
import { escapeHtml } from './genericFunctions';

/**
 * Pure helpers that turn a Server Actor's OpenAPI document (`actorDefinition.webServerSchema`
 * of its default build) into endpoint options and typed resource mapper fields. No n8n context
 * or HTTP here, so everything is unit-testable.
 */

type JsonObject = Record<string, unknown>;

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

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

// Resolved `$ref`s nest at most this deep, which also stops reference cycles.
const MAX_REF_DEPTH = 10;

// Field id prefixes: they tell the node where a value goes in the request.
export const FIELD_LOCATIONS = ['path', 'query', 'body'] as const;
export type FieldLocation = (typeof FIELD_LOCATIONS)[number];
// Id of the single field used when the request body isn't an object with properties.
export const WHOLE_BODY_FIELD_ID = 'body';

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

/** Returns `node` with its local `$ref`s resolved. Unresolvable or remote refs become `{}`. */
export function resolveRefs(document: JsonObject, node: unknown, depth = 0): unknown {
	if (depth > MAX_REF_DEPTH) return {};
	if (Array.isArray(node)) return node.map((item) => resolveRefs(document, item, depth + 1));
	if (!isObject(node)) return node;
	if (typeof node.$ref === 'string') {
		const target = resolvePointer(document, node.$ref);
		return target === undefined ? {} : resolveRefs(document, target, depth + 1);
	}
	return Object.fromEntries(
		Object.entries(node).map(([key, value]) => [key, resolveRefs(document, value, depth + 1)]),
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
	if (!match || !(HTTP_METHODS as readonly string[]).includes(match[1])) return undefined;
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

function getFieldType(schema: JsonObject | undefined): FieldType {
	switch (schema?.type) {
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

function getEnumOptions(schema: JsonObject | undefined): INodePropertyOptions[] {
	const values = Array.isArray(schema?.enum) ? schema.enum : [];
	return values
		.filter(
			(value): value is string | number | boolean =>
				typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean',
		)
		.map((value) => ({ name: String(value), value }));
}

function isNumberSchema(schema: JsonObject | undefined): boolean {
	return schema?.type === 'integer' || schema?.type === 'number';
}

/** The schema's `default` as a field value; object and array fields are edited as JSON text. */
function getDefaultValue(schema: JsonObject | undefined): ResourceMapperField['defaultValue'] {
	const value = schema?.default;
	if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
		return value;
	}
	if (value !== null && typeof value === 'object') return JSON.stringify(value, null, 2);
	return undefined;
}

function toField(
	id: string,
	displayName: string,
	schema: JsonObject | undefined,
	required: boolean,
): ResourceMapperField {
	const options = getEnumOptions(schema);
	const defaultValue = getDefaultValue(schema);
	let type: FieldType = options.length > 0 ? 'options' : getFieldType(schema);
	// n8n's number input stores 0 as soon as the field is added, and that 0 would be sent in
	// place of the Actor's own default. Without a default to prefill, take the number as text,
	// which stays empty until filled in; the node converts it back (see getNumberFieldIds).
	if (type === 'number' && typeof defaultValue !== 'number') type = 'string';
	return {
		id,
		displayName,
		defaultMatch: false,
		required,
		display: true,
		type,
		...(options.length > 0 ? { options } : {}),
		// Prefill the Actor's own default, so adding a field doesn't change what it gets.
		// Without one, n8n leaves the field empty (booleans start as false).
		...(defaultValue !== undefined ? { defaultValue } : {}),
		// Show what must be filled in. The rest can be added from the list, and the server
		// applies its own defaults to what's left out.
		removed: !required,
	};
}

/** Builds a resource mapper field id such as `query:limit`. */
export function toFieldId(location: FieldLocation, name: string): string {
	return `${location}:${name}`;
}

/** Splits a field id back into its location and name. */
export function parseFieldId(id: string): { location: FieldLocation | 'wholeBody'; name: string } {
	if (id === WHOLE_BODY_FIELD_ID) return { location: 'wholeBody', name: id };
	const separator = id.indexOf(':');
	const location = id.slice(0, separator) as FieldLocation;
	if (separator > 0 && FIELD_LOCATIONS.includes(location)) {
		return { location, name: id.slice(separator + 1) };
	}
	// Unknown prefix: treat it as a query parameter rather than dropping the value.
	return { location: 'query', name: id };
}

interface FieldEntry {
	location: FieldLocation;
	name: string;
	schema: JsonObject | undefined;
	field: ResourceMapperField;
}

function getFieldEntries(
	document: JsonObject | undefined,
	method: string,
	path: string,
): FieldEntry[] | undefined {
	const operation = getEndpointOperation(document, method, path);
	if (!document || !operation) return undefined;

	const entries: FieldEntry[] = [];
	for (const parameter of operation.parameters) {
		if (parameter.in !== 'path' && parameter.in !== 'query') continue;
		const schema = resolveRefs(document, parameter.schema) as JsonObject | undefined;
		const required = parameter.in === 'path' || parameter.required === true;
		const id = toFieldId(parameter.in, parameter.name);
		entries.push({
			location: parameter.in,
			name: parameter.name,
			schema,
			field: toField(id, parameter.name, schema, required),
		});
	}

	if (method !== 'GET' && operation.bodySchema) {
		const bodySchema = resolveRefs(document, operation.bodySchema) as JsonObject;
		const properties = isObject(bodySchema.properties) ? bodySchema.properties : undefined;
		if (properties && Object.keys(properties).length > 0) {
			const requiredNames = new Set(Array.isArray(bodySchema.required) ? bodySchema.required : []);
			for (const [name, rawSchema] of Object.entries(properties)) {
				const schema = isObject(rawSchema) ? rawSchema : undefined;
				entries.push({
					location: 'body',
					name,
					schema,
					field: toField(toFieldId('body', name), name, schema, requiredNames.has(name)),
				});
			}
		} else {
			const field = toField(WHOLE_BODY_FIELD_ID, 'Body (JSON)', bodySchema, operation.bodyRequired);
			// A body without a usable schema is edited as JSON either way.
			if (field.type !== 'array') field.type = 'object';
			delete field.options;
			entries.push({ location: 'body', name: WHOLE_BODY_FIELD_ID, schema: undefined, field });
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
	// Add the location to a label only when the same name appears in two places.
	const nameCounts = new Map<string, number>();
	for (const { name } of entries) nameCounts.set(name, (nameCounts.get(name) ?? 0) + 1);
	return entries.map(({ location, name, field }) =>
		(nameCounts.get(name) ?? 0) > 1 ? { ...field, displayName: `${name} (${location})` } : field,
	);
}

/** Ids of the endpoint's fields whose schema is a number, so text values can be converted back. */
export function getNumberFieldIds(
	document: JsonObject | undefined,
	method: string,
	path: string,
): Set<string> {
	return new Set(
		(getFieldEntries(document, method, path) ?? [])
			.filter(({ schema }) => isNumberSchema(schema))
			.map(({ field }) => field.id),
	);
}
