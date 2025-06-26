import { INodeProperties } from 'n8n-workflow';

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
				resource: ['Key-Value Stores'],
				operation: ['Get Key-Value Store Record'],
			},
		},
	},
	{
		displayName: 'Key-Value Store ID',
		name: 'storeId',
		required: true,
		description: 'The ID of the Key-Value Store',
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['Key-Value Stores'],
				operation: ['Get Key-Value Store Record'],
			},
		},
	},
	{
		displayName: 'Key-Value Store Record Key',
		name: 'recordKey',
		required: true,
		description: 'The key of the record to be retrieved',
		default: 'RECORD_KEY',
		type: 'string',
		displayOptions: {
			hide: {
				storeId: [''], // Hide while storeId is not set
			},
			show: {
				resource: ['Key-Value Stores'],
				operation: ['Get Key-Value Store Record'],
			},
		},
	},
];
