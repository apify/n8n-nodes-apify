/* eslint-disable n8n-nodes-base/node-param-option-description-identical-to-name */
/* eslint-disable n8n-nodes-base/node-param-display-name-miscased-id */
/* eslint-disable n8n-nodes-base/node-param-display-name-miscased-id */
/* eslint-disable n8n-nodes-base/node-param-description-boolean-without-whether */
/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */

/**
 * The following code was generated create-n8n-nodes tool.
 *
 * This file was automatically generated and should not be edited.
 *
 * If changes are required, please refer to the templates and scripts in the repository.
 * Repository: https://github.com/oneflow-vn/create-n8n-nodes
 */

import { INodePropertyOptions } from 'n8n-workflow'

// @ts-ignore
import * as helpers from '../../../helpers'

import { properties as rawProperties } from './properties'
import { runHooks } from './hooks'

export const name = 'Run task synchronously (GET)'

const rawOption: INodePropertyOptions = {
  name: 'Run task synchronously (GET)',
  value: 'Run task synchronously (GET)',
  action: 'Run task synchronously (GET)',
  description:
    'Run a specific task and return its output  The run must finish in 300     MAX ACTOR JOB SYNC WAIT SECS     seconds otherwise the HTTP request fails with a timeout error  this won t abort the run itself   Beware that it might be impossible to maintain an idle HTTP connection for an extended period  due to client timeout or network conditions  Make sure your HTTP client is configured to have a long enough connection timeout  If the connection breaks  you will not receive any information about the run and its status  To run the Task asynchronously  use the  Run task asynchronously    reference actor tasks run collection run task  endpoint instead',
  routing: {
    request: {
      method: 'GET',
      url: '=/v2/actor-tasks/{{$parameter["actorTaskId"]}}/run-sync',
    },
  },
}

const { properties, option } = runHooks(rawOption, rawProperties)

export { option, properties }
