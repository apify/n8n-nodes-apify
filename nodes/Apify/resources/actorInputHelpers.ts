import { IExecuteFunctions } from 'n8n-workflow';

function isEmpty(v: unknown): boolean {
	if (v === null || v === undefined) return true;
	if (typeof v === 'string') return v.trim() === '';
	if (Array.isArray(v)) return v.length === 0;
	if (typeof v === 'object') return Object.keys(v as object).length === 0;
	return false;
}

function coerce(v: unknown): unknown {
	if (typeof v === 'string') {
		const t = v.trim();
		if (t.startsWith('{') || t.startsWith('[')) {
			try {
				return JSON.parse(t);
			} catch {
				return v;
			}
		}
	}
	return v;
}

/**
 * Builds Actor run input from either schema-mapped fields or the raw JSON body,
 * depending on `actorInputMode`.
 */
export function resolveActorInput(this: IExecuteFunctions, i: number): string | object {
	// Default to JSON so existing workflows (and nodes without actorInputMode) keep working.
	const mode = this.getNodeParameter('actorInputMode', i, 'json') as 'schema' | 'json';

	if (mode === 'json') {
		return this.getNodeParameter('customBody', i, '{}') as string | object;
	}

	const mapped = this.getNodeParameter('actorInput', i, {}) as {
		value?: Record<string, unknown>;
	};
	const mappedValues = mapped?.value && typeof mapped.value === 'object' ? mapped.value : {};
	const mappedInput: Record<string, unknown> = {};

	for (const [k, v] of Object.entries(mappedValues)) {
		const cv = coerce(v);
		// Skip empty values (incl. [] and {}) so we never override the Actor's own defaults.
		if (isEmpty(cv)) continue;
		mappedInput[k] = cv;
	}

	return mappedInput;
}
