import NodeList from "../../../nodeList/NodeList.jsx";
import AbstractNodeType from "../AbstractNodeType.jsx";
import './element.css';
import classNames from "classnames";

export default class Element extends AbstractNodeType {
    renderCollapsed() {
        const { node } = this.props;
        const { isCollapsed } = this.state;

        return (
            <li
                className={ classNames('element', {
                    'element--collapsed': isCollapsed,
                    'element--has-child-nodes': !!node.childNodes?.length
                })}
                onClick={this.onClick}>
                {this.getStartTag()}
                {!!node.childNodes?.length && (
                    <>
                        <span className='element__three-dots'></span>
                        {this.getEndTag()}
                    </>
                )}
            </li>
        );
    }

    getStartTag() {
        const { node } = this.props;

        return (
            <>
                <span className='element__tag'>{`<${node.tagName.toLowerCase()}`}</span>
                <span className='element__attributes'>{this.renderAttributes(node)}</span>
                <span className='element__tag'>{'>'}</span>
            </>
        );
    }

    getEndTag() {
        const { node } = this.props;

        return (
            <>
                <span className='element__tag'>
                    {`</${node.tagName.toLowerCase()}>`}
                </span>
            </>
        );
    }

    renderExtended() {
        const { node } = this.props;
        const { isCollapsed } = this.state;

        if (!node.childNodes?.length) {
            return this.renderCollapsed();
        }

        return (
            <>
               <li
                   className={ classNames('element', {
                       'element--collapsed': isCollapsed,
                       'element--has-child-nodes': !!node.childNodes?.length
                   })}
                   onClick={this.onClick}>
                   {this.getStartTag()}
               </li>
               <NodeList nodes={node.childNodes} />
               <li className='element__end'>
                   {this.getEndTag()}
               </li>
            </>
        );
    }
}
