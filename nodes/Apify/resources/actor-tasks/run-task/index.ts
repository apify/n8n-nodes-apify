import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

export const name = 'Run task';

const rawOption: INodePropertyOptions = {
	name: 'Run Task',
	value: 'Run task',
	action: 'Run task',
	description:
		'Runs an actor task and immediately returns without waiting for the run to finish Optionally you can override the actor input configuration by passing a JSON object as the POST payload and setting the Content Type application JSON HTTP header Note that if the object in the POST payload does not define a particular input property the actor run uses the default value defined by the task or actor s input schema if not defined by the task The response is the actor Run object as returned by the Get run endpoint If you want to wait for the run to finish and receive the actual output of the actor run as the response use one of the Run task synchronously API endpoints instead To fetch the actor run results that are typically stored in the default dataset you ll need to pass the ID received in the defaultDatasetId field received in the response JSON to the Get items API endpoint',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties };
