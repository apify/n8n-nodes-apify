import {
	IWorkflowExecuteAdditionalData,
	NodeHelpers,
	WebhookSetupMethodNames,
	Workflow,
	IWebhookData,
	IHttpRequestMethods,
	IWebhookDescription,
	INode,
} from 'n8n-workflow';
import { NodeExecuteFunctions } from 'n8n-core';

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
		httpMethod: method as IHttpRequestMethods,
		path: '/webhook',
	};

	const webhookData: IWebhookData = {
		httpMethod: method as IHttpRequestMethods,
		node: webhookNode.webhookId || 'test',
		path: '/webhook',
		webhookDescription,
		workflowId: workflow.id,
		workflowExecuteAdditionalData: additionalData,
	};

	const result = await workflow.runWebhook(
		webhookData,
		webhookNode as unknown as INode,
		additionalData,
		NodeExecuteFunctions,
		'manual',
	);

	return result;
};
