import { Component } from 'preact';

import NodeList from '../nodeList/NodeList.jsx';
import './dom.css';

export default class Dom extends Component {
  constructor() {
    super();
  }

  render() {
    return <NodeList nodes={document.childNodes} className='dom' />;
  }
}
