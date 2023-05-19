import AbstractNodeType from '../AbstractNodeType.jsx';

export default class Text extends AbstractNodeType {
  renderCollapsed() {
    const { node } = this.props;
    const content = node.textContent.trim();

    if (!content) {
      return null;
    }

    return <li onClick={this.onClick}>{node.textContent}</li>;
  }

  renderExtended() {
    return this.renderCollapsed();
  }
}
