import {
	IDataObject,
	INodeType,
	INodeTypeData,
	INodeTypes,
	IVersionedNodeType,
	NodeHelpers,
} from 'n8n-workflow';
import { Apify } from '../../Apify.node';
import { ApifyTrigger } from '../../ApifyTrigger.node';

export class NodeTypesClass implements INodeTypes {
	nodeTypes: INodeTypeData = {};
	getByName(nodeType: string): INodeType | IVersionedNodeType {
		return this.nodeTypes[nodeType].type;
	}

	getKnownTypes(): IDataObject {
		return this.nodeTypes;
	}

	addNode(nodeTypeName: string, nodeType: INodeType | IVersionedNodeType) {
		const loadedNode = {
			[nodeTypeName]: {
				sourcePath: '',
				type: nodeType,
			},
		};

		this.nodeTypes = {
			...this.nodeTypes,
			...loadedNode,
		};

		Object.assign(this.nodeTypes, loadedNode);
	}

	getByNameAndVersion(nodeType: string, version?: number): INodeType {
		return NodeHelpers.getVersionedNodeType(this.nodeTypes[nodeType].type, version);
	}
}

const nodeTypes = new NodeTypesClass();

nodeTypes.addNode('n8n-nodes-apify.apify', new Apify());
nodeTypes.addNode('n8n-nodes-apify.apifyTrigger', new ApifyTrigger());

export { nodeTypes };
