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

import { INodeProperties } from 'n8n-workflow'

// @ts-ignore
import * as helpers from '../../../helpers'

export const properties: INodeProperties[] = [
  {
    displayName: 'GET /v2/actor-tasks',
    name: 'operation',
    type: 'notice',
    typeOptions: {
      theme: 'info',
    },
    default: '',
    displayOptions: {
      show: {
        resource: ['Actor tasks'],
        operation: ['Get list of tasks'],
      },
    },
  },
  {
    displayName: 'Offset',
    name: 'offset',
    description:
      'Number of records that should be skipped at the start. The default value is `0`.\n',
    default: 0,
    type: 'number',
    routing: {
      request: {
        qs: {
          offset: '={{ $value }}',
        },
      },
    },
    displayOptions: {
      show: {
        resource: ['Actor tasks'],
        operation: ['Get list of tasks'],
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    description:
      'Maximum number of records to return. The default value as well as the maximum is `1000`.\n',
    default: 99,
    type: 'number',
    routing: {
      request: {
        qs: {
          limit: '={{ $value }}',
        },
      },
    },
    displayOptions: {
      show: {
        resource: ['Actor tasks'],
        operation: ['Get list of tasks'],
      },
    },
  },
  {
    displayName: 'Desc',
    name: 'desc',
    description:
      'If `true` or `1` then the objects are sorted by the `createdAt` field in\ndescending order. By default, they are sorted in ascending order.\n',
    default: true,
    type: 'boolean',
    routing: {
      request: {
        qs: {
          desc: '={{ $value }}',
        },
      },
    },
    displayOptions: {
      show: {
        resource: ['Actor tasks'],
        operation: ['Get list of tasks'],
      },
    },
  },
]
