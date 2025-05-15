import { INodeProperties } from 'n8n-workflow';

// @ts-ignore
import * as helpers from '../../../helpers';

export const properties: INodeProperties[] = [
	{
		displayName: 'GET /v2/key-value-stores/{storeId}/records/{recordKey}',
		name: 'operation',
		type: 'notice',
		typeOptions: {
			theme: 'info',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['Key-value Stores'],
				operation: ['Get Key-value Store Record'],
			},
		},
	},
	{
		displayName: 'Key-value Store ID',
		name: 'storeId',
		required: true,
		description: 'The ID of the Key-value Store.',
		default: 'dmXls2mjfQVdzfrC6',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Key-value Stores'],
				operation: ['Get Key-value Store Record'],
			},
		},
	},
	{
		displayName: 'Record Key',
		name: 'recordKey',
		required: true,
		description: 'The key of the record to be retrieved.',
		default: 'RECORD_KEY',
		type: 'string',
		displayOptions: {
			hide: {
				storeId: [''], // Hide if storeId is not set
			},
			show: {
				resource: ['Key-value Stores'],
				operation: ['Get Key-value Store Record'],
			},
		},
	},
];
