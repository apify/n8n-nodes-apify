/**
 * ⚠️  DEMO / PROOF-OF-CONCEPT — NOT production code. Committed only to preserve the prototype.
 *
 * Explores pulling an Actor's default input into the node UI via n8n's resourceMapper:
 * fetches the selected Actor's default build, reads its INPUT_SCHEMA, and exposes the
 * prefilled properties as editable, mappable fields. Other schema fields are hidden but
 * offered through the "Add field" dropdown.
 *
 * Wired into the "Run an Actor" operation only (see run-actor/properties.ts + execute.ts).
 *
 * Known gaps (why this stays demo-only):
 *   - Only "Run an Actor" — run-task and the *-and-get-dataset operations are untouched.
 *   - Value coercion is best-effort (JSON.parse for object/array-looking strings).
 *   - No automated tests.
 *   - resourceMapper can only represent fields defined in the schema; the raw Input JSON
 *     field can still send arbitrary keys, which is why that field is kept alongside this.
 */
import {
	ILoadOptionsFunctions,
	ResourceMapperField,
	ResourceMapperFields,
	FieldType,
} from 'n8n-workflow';
import { apiRequest } from './genericFunctions';

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
				'No default build for this Actor yet — its input fields could not be loaded. Use the Input JSON field instead.',
		};
	}

	const props = schema?.properties ?? {};
	const requiredKeys: string[] = Array.isArray(schema?.required) ? schema.required : [];

	const fields: ResourceMapperField[] = [];
	for (const key of Object.keys(props)) {
		const p = props[key];
		const type = mapType(p);
		const hasPrefill = p?.prefill != null;
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
