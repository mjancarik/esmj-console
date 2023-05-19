import { Component } from 'preact';
import classNames from 'classnames';
import Node from '../node/Node.jsx';
import './nodeList.css';

export default class NodeList extends Component {
  render() {
    const { nodes } = this.props;

    if (!nodes || !nodes.length) {
      return null;
    }

    return (
      <ul className={classNames('node-list', this.props.className)}>
        {Array.from(nodes).map((childNode, index) => (
          <Node key={index} node={childNode} />
        ))}
      </ul>
    );
  }
}
