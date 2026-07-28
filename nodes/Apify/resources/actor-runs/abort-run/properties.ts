import { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
  {
    displayName: 'Run ID',
    name: 'abortRunId',
    required: true,
    default: '',
    type: 'string',
    description: 'The ID of the Actor run to abort',
    displayOptions: {
      show: {
        resource: ['Actor runs'],
        operation: ['Abort run'],
      },
    },
  },
  {
    displayName: 'Graceful',
    name: 'gracefully',
    type: 'boolean',
    default: false,
    description:
      'Whether to abort the run gracefully, giving the Actor time to finish its current task before being terminated. If disabled, the run is killed immediately.',
    displayOptions: {
      show: {
        resource: ['Actor runs'],
        operation: ['Abort run'],
      },
    },
  },
];