import AbstractNodeType from '../AbstractNodeType.jsx';
import './documentType.css';

export default class DocumentType extends AbstractNodeType {
  renderCollapsed() {
    const { node } = this.props;

    let content = '<!DOCTYPE';

    if (node.name) {
      content += ` ${node.name}`;
    }

    if (node.publicId) {
      content += ` ${node.publicId}`;
    }

    if (node.systemId) {
      content += ` ${node.systemId}`;
    }

    content += `>`;

    return <li className='document-type'>{content}</li>;
  }

  renderExtended() {
    return this.renderCollapsed();
  }
}
