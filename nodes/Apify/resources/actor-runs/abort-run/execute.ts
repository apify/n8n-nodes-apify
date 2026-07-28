import {
  IExecuteFunctions,
  INodeExecutionData,
  NodeApiError,
  NodeOperationError,
} from 'n8n-workflow';
import { apiRequest } from '../../../resources/genericFunctions';

export async function abortRun(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
  const runId = this.getNodeParameter('abortRunId', i) as string;
  const gracefully = this.getNodeParameter('gracefully', i, false) as boolean;

  if (!runId) {
    throw new NodeOperationError(this.getNode(), 'Run ID is required');
  }

  try {
    const apiResult = await apiRequest.call(this, {
      method: 'POST',
      uri: `/v2/actor-runs/${runId}/abort`,
      qs: gracefully ? { gracefully: true } : {},
    });

    return { json: { ...apiResult.data } };
  } catch (error) {
    throw new NodeApiError(this.getNode(), error);
  }
}
