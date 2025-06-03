import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const name = 'Run actor';

const rawOption: INodePropertyOptions = {
	name: 'Run an Actor',
	value: 'Run actor',
	action: 'Run an Actor',
	description:
		'Runs an Actor and immediately returns without waiting for the run to finish. The POST payload including its Content Type header is passed as INPUT to the Actor usually application JSON The Actor is started with the default options you can override them using various URL query parameters The response is the Run object as returned by the Get run API endpoint If you want to wait for the run to finish and receive the actual output of the Actor as the response please use one of the Run Actor synchronously API endpoints instead To fetch the Actor run results that are typically stored in the default dataset you ll need to pass the ID received in the defaultDatasetId field received in the response JSON to the Get items API endpoint.',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
