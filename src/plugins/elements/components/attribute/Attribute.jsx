import { Component } from 'preact';
import './attribute.css';

export default class Attribute extends Component {
  render() {
    const { attribute } = this.props;

    return (
      <span className='attribute'>
        <span className='attribute__key'>{attribute.name}=&quot;</span>
        <span className='attribute__value'>{attribute.value}</span>
        <span className='attribute__key'>&quot;</span>
      </span>
    );
  }
}
