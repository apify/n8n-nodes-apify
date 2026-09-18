import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const webFetchName = 'Web Fetch';

const rawOption: INodePropertyOptions = {
	name: 'Web Fetch',
	value: webFetchName,
	action: webFetchName,
	description:
		'Fetch a single URL and get its content as markdown, HTML, text, links, or raw - exactly the requested formats, from a single fast API call',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
