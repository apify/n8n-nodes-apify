import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const name = 'Run task';

const rawOption: INodePropertyOptions = {
	name: 'Run Task',
	value: 'Run task',
	action: 'Run task',
	description:
		"Runs an Actor task and immediately returns without waiting for the run to complete. You can optionally override the Actor's input configuration by passing a JSON object as the POST payload and setting the Content-Type HTTP header to application/JSON. If the object in the POST payload doesn't define a particular input property, the Actor run will use the default value defined by the task or by the Actor's input schema if not specified in the task. The response is the Actor run object, as returned by the Get run endpoint. If you want to wait for the run to finish and receive the actual output of the Actor run as the response, use one of the \"run task synchronously\" API endpoints instead. To fetch the Actor run results, which are typically stored in the default dataset, use the ID from the defaultDatasetId field in the response JSON and pass it to the Get items API endpoint",
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
