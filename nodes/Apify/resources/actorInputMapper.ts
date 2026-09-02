/**
 * Loads an Actor's input schema into n8n's resourceMapper so each schema property
 * becomes an editable field (incl. expressions / $fromAI on individual fields).
 *
 * Used when actorInputMode === 'schema'. Needs a resolvable Actor ID at config time
 * (list/URL/ID). If the Actor is set via expression / $fromAI(), fields cannot be loaded.
 */
import {
	ILoadOptionsFunctions,
	ResourceMapperField,
	ResourceMapperFields,
	FieldType,
} from 'n8n-workflow';
import { apiRequest } from './genericFunctions';

function isExpressionValue(value: unknown): boolean {
	return typeof value === 'string' && value.startsWith('=');
}

function isEmptyValue(v: any): boolean {
	if (v == null) return true;
	if (typeof v === 'string') return v.trim() === '';
	if (Array.isArray(v)) return v.length === 0;
	if (typeof v === 'object') return Object.keys(v).length === 0;
	return false;
}

function mapType(prop: any): FieldType {
	if (Array.isArray(prop?.enum) && prop.enum.length) return 'options';
	switch (prop?.type) {
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

export async function getActorInputFields(
	this: ILoadOptionsFunctions,
): Promise<ResourceMapperFields> {
	let actorId = '';
	try {
		const raw = this.getNodeParameter('actorId', '') as any;
		actorId = raw && typeof raw === 'object' ? (raw.value ?? '') : (raw ?? '');
	} catch {
		actorId = '';
	}

	if (!actorId) {
		return { fields: [], emptyFieldsNotice: 'Select an Actor to load its input fields.' };
	}

	if (isExpressionValue(actorId)) {
		return {
			fields: [],
			emptyFieldsNotice:
				'Actor is set via an expression or $fromAI(), so its input schema cannot be loaded. Switch Actor Input to "Using JSON", or select a fixed Actor.',
		};
	}

	let schema: any;
	try {
		const resp = await apiRequest.call(this, {
			method: 'GET',
			uri: `/v2/acts/${actorId}/builds/default`,
		});
		const build = resp?.data ?? {};
		// Canonical location is `actorDefinition.input`; older responses expose the schema as a
		// stringified `inputSchema`.
		schema = build?.actorDefinition?.input;
		if (!schema && typeof build?.inputSchema === 'string') {
			schema = JSON.parse(build.inputSchema);
		}
	} catch {
		return {
			fields: [],
			emptyFieldsNotice:
				'No default build for this Actor yet — its input fields could not be loaded. Switch Actor Input to "Using JSON".',
		};
	}

	const props = schema?.properties ?? {};
	const requiredKeys: string[] = Array.isArray(schema?.required) ? schema.required : [];

	const fields: ResourceMapperField[] = [];
	for (const key of Object.keys(props)) {
		const p = props[key];
		const type = mapType(p);
		const hasPrefill = !isEmptyValue(p?.prefill);
		const isRequired = requiredKeys.includes(key);
		let def: any = hasPrefill ? p.prefill : undefined;
		if (def !== undefined && typeof def === 'object') def = JSON.stringify(def);
		const label = p?.title || key;
		const field: ResourceMapperField = {
			id: key,
			// Flag required fields in the label rather than via `required: true` — the latter locks
			// the field (can't be removed) and forces an empty/null value to be sent for fields
			// that have no prefill. Apify enforces required inputs server-side anyway.
			displayName: isRequired ? `${label} (required)` : label,
			type,
			required: false,
			display: true,
			defaultMatch: false,
			// Only prefilled fields are shown by default; everything else (incl. required-but-not-
			// prefilled) is available via the "Add field" dropdown so users can add it on demand.
			removed: !hasPrefill,
		};
		if (type === 'options' && Array.isArray(p?.enum)) {
			field.options = p.enum.map((v: any, i: number) => ({
				name: String(p?.enumTitles?.[i] ?? v),
				value: v,
			}));
		}
		if (def !== undefined) {
			field.defaultValue = def as string | number | boolean | null;
		}
		fields.push(field);
	}

	if (!fields.length) {
		return { fields: [], emptyFieldsNotice: 'This Actor has no configurable input fields.' };
	}
	return { fields };
}
