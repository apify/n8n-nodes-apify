import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

// Stored in saved workflows: never rename it.
export const name = 'Send Server Actor request';

const rawOption: INodePropertyOptions = {
	// n8n's linter requires Title Case for the label; the stored value stays as is.
	name: 'Send Server Actor Request',
	value: name,
	action: 'Send a Server Actor request',
	description:
		"Sends one HTTP request to a Server Actor's endpoint and returns its response, without starting a run",
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
