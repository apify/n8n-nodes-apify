
import { INodePropertyOptions } from 'n8n-workflow';

import { properties as rawProperties } from './properties';
import { runHooks } from './hooks';

const name = 'Abort run';

const rawOption: INodePropertyOptions = {
  name: name,
  value: name,
  action: 'Abort an Actor run',
  description: 'Abort a running Actor run',
};

const { properties, option } = runHooks(rawOption, rawProperties);

export { option, properties, name };