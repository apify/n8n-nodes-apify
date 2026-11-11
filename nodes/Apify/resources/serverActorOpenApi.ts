import { INodePropertyOptions } from 'n8n-workflow';
import { HTTP_METHODS } from '../helpers/consts';
import { escapeHtml } from './genericFunctions';

/**
 * Pure helpers that read a Server Actor's OpenAPI document (`actorDefinition.webServerSchema`
 * of its default build): the endpoint options and each endpoint's operation. No n8n context
 * or HTTP here, so everything is unit-testable.
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

/** Names of an operation's array query parameters that are sent comma-separated (`explode: false`). */
export function getNonExplodedQueryParams(parameters: OpenApiParameter[]): Set<string> {
	return new Set(
		parameters
			.filter((parameter) => parameter.in === 'query' && parameter.explode === false)
			.map((parameter) => parameter.name),
	);
}
