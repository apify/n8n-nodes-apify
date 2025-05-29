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

import { INodeProperties } from 'n8n-workflow';

// @ts-ignore
import * as helpers from '../../../helpers';

export const properties: INodeProperties[] = [
	{
		displayName: 'GET /v2/datasets/{datasetId}/items',
		name: 'operation',
		type: 'notice',
		typeOptions: {
			theme: 'info',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['Datasets'],
				operation: ['Get items'],
			},
		},
	},
	{
		displayName: 'Dataset ID',
		name: 'datasetId',
		required: true,
		description: 'Dataset ID or `username~dataset-name`',
		default: 'WkzbQMuFYuamGv3YF',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Datasets'],
				operation: ['Get items'],
			},
		},
	},
	{
		displayName: 'Offset',
		name: 'offset',
		description: 'Number of items that should be skipped at the start. The default value is `0`.',
		default: null,
		type: 'number',
		routing: {
			request: {
				qs: {
					offset: '={{ $value || $value === 0 ? $value : undefined }}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: ['Datasets'],
				operation: ['Get items'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		description: 'Max number of results to return',
		default: 50,
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		routing: {
			request: {
				qs: {
					limit: '={{ $value || $value === 0 ? $value : undefined }}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: ['Datasets'],
				operation: ['Get items'],
			},
		},
	},
	{
		displayName: 'Format',
		name: 'format',
		description:
			'Format of the results, possible values are: `JSON`, `jsonl`, `csv`, `html`, `xlsx`, `xml` and `rss`. The default value is `JSON`.',
		default: 'json',
		type: 'string',
		routing: {
			request: {
				qs: {
					format: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: ['Datasets'],
				operation: ['Get items'],
			},
		},
	},
];
