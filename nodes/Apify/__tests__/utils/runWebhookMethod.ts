import {
	IWorkflowExecuteAdditionalData,
	NodeHelpers,
	WebhookSetupMethodNames,
	Workflow,
	IWebhookData,
	IWebhookDescription,
} from 'n8n-workflow';
import { NodeExecuteFunctions } from 'n8n-core';
import { INodeExecuteFunctions } from 'n8n-workflow';
import { WorkflowExecuteMode } from 'n8n-workflow';
import { WorkflowActivateMode } from 'n8n-workflow';

export const runWebhookMethod = async (
	workflow: Workflow,
	additionalData: IWorkflowExecuteAdditionalData,
	method: WebhookSetupMethodNames,
) => {
	const [webhookNode] = NodeHelpers.getNodeWebhooks(
		workflow,
		Object.values(workflow.nodes)[0],
		additionalData,
	);

	const webhookDescription: IWebhookDescription = {
		name: 'default',
		httpMethod: 'POST',
		responseMode: 'onReceived',
		path: 'webhook',
	};

	const webhookData: IWebhookData = {
		httpMethod: 'POST',
		node: webhookNode.node,
		path: 'webhook',
		webhookDescription,
		workflowId: workflow.id,
		workflowExecuteAdditionalData: additionalData,
	};

	/*
	 * Override runWebhookMethod which is a private method of the workflow
	 * but is needed for the tests.
	 */
	return (
		workflow as unknown as Record<string, any> & {
			runWebhookMethod: (
				method: WebhookSetupMethodNames,
				webhookData: IWebhookData,
				nodeExecuteFunctions: INodeExecuteFunctions,
				mode: WorkflowExecuteMode,
				activation: WorkflowActivateMode,
				isTest?: boolean,
			) => Promise<boolean | undefined>;
		}
	).runWebhookMethod(method, webhookData, NodeExecuteFunctions, 'manual', 'manual', true);
};
