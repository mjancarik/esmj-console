import { Component } from 'preact';
import Element from "./nodeTypes/element/Element";
import Text from "./nodeTypes/text/Text";
import DocumentType from "./nodeTypes/documentType/DocumentType.jsx";

export default class Node extends Component {
    static get nodeTypeComponents() {
        return {
            1: Element,
            3: Text,
            10: DocumentType
        };
    }

    render() {
        const { node } = this.props;
        const NodeTypeComponent = Node.nodeTypeComponents[node.nodeType];

        if (!NodeTypeComponent) {
            console.log(`Chybí komponenta pro nodeType ${node.nodeType}`);
            return null;
        }

        return <NodeTypeComponent node={node} />;
    }
}
