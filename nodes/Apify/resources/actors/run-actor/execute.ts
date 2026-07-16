import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { executeActor } from '../../executeActor';

export async function runActor(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
	const actorId = this.getNodeParameter('actorId', i, undefined, {
		extractValue: true,
	}) as string;
	const timeout = this.getNodeParameter('timeout', i) as number | null;
	const memory = this.getNodeParameter('memory', i) as number | null;
	const maxTotalChargeUsd = this.getNodeParameter('maxTotalChargeUsd', i, null) as number | null;
	const buildParam = this.getNodeParameter('build', i) as string | null;
	const waitForFinish = this.getNodeParameter('waitForFinish', i) as boolean;

	// ─── DEMO / PROOF-OF-CONCEPT (not production) — see resources/actorInputMapper.ts ──────
	// Use the mapped resourceMapper input if the user set any values, otherwise fall back to
	// the raw Input JSON field.
	const mapped = this.getNodeParameter('actorInput', i, {}) as { value?: Record<string, unknown> };
	const mappedValues = mapped?.value && typeof mapped.value === 'object' ? mapped.value : {};
	const coerce = (v: unknown) => {
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
	};
	const isEmpty = (v: unknown) => {
		if (v === null || v === undefined) return true;
		if (typeof v === 'string') return v.trim() === '';
		if (Array.isArray(v)) return v.length === 0;
		if (typeof v === 'object') return Object.keys(v as object).length === 0;
		return false;
	};
	const mappedInput: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(mappedValues)) {
		const cv = coerce(v);
		// Skip empty values (incl. [] and {}) so we never override the Actor's own defaults.
		if (isEmpty(cv)) continue;
		mappedInput[k] = cv;
	}
	const rawStringifiedInput = Object.keys(mappedInput).length
		? mappedInput
		: (this.getNodeParameter('customBody', i, '{}') as string | object);

	const { lastRunData } = await executeActor.call(this, {
		actorId,
		timeout,
		memory,
		maxTotalChargeUsd,
		buildParam,
		rawStringifiedInput,
		waitForFinish,
	});

	return {
		json: { ...lastRunData },
	};
}
