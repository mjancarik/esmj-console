import { Component } from 'preact';
import Attribute from '../../attribute/Attribute';

export default class AbstractNodeType extends Component {
  constructor() {
    super();

    this.state = {
      isCollapsed: true,
    };
    this.onClick = this.onClick.bind(this);
  }

  render() {
    const { isCollapsed } = this.state;

    return isCollapsed ? this.renderCollapsed() : this.renderExtended();
  }

  renderCollapsed() {
    throw new Error(
      'AbstractNodeType.renderCollapsed is abstract and has to be overriden.'
    );
  }

  renderExtended() {
    throw new Error(
      'AbstractNodeType.renderExtended is abstract and has to be overriden.'
    );
  }

  renderAttributes(node) {
    if (!node.attributes.length) {
      return '';
    }

    return Array.from(node.attributes).map((attribute) => (
      <>
        {' '}
        <Attribute attribute={attribute} />
      </>
    ));
  }

  onClick() {
    this.setState({
      isCollapsed: !this.state.isCollapsed,
    });
  }
}
