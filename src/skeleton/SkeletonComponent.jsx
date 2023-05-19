import { Component } from 'preact';
import { context } from './context';

function StickyButton({ widget, children }) {
  const style = {
    width: `${widget.$external.buttonSize}px`,
    height: `${widget.$external.buttonSize}px`,
    backgroundColor: 'darkGray',
    lineHeight: `${widget.$external.buttonSize}px`,
    textAlign: 'center',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '18px',
    color: 'white',
  };

  return (
    <div style={style} onClick={() => widget.setState({ open: !widget.state.open })}>
      {widget.state.open ? '{}' : '{ }'}
      {children}
    </div>
  );
}

function ToolWindow({ widget, children }) {
  const style = {
    width: '100%',
    height: `calc(100vh - ${`${widget.$external.buttonSize}px`})`,
    backgroundColor: 'lightGray',
  };
  const { view: View } = widget.router.getCurrentRoute();

  return (
    <div style={style}>
      <>
        <Menu widget = {widget}/>
        {children}
        {widget.state.open && < View widget = {widget}/>}
      </>
    </div>
  );
}

function Menu({ widget }) {
  const listStyle = {
    listStyle: 'none',
    margin: '0 0 4px 0',
    borderBottom: '1px solid darkGray',
    padding: '0',
  }

  const defaultItemStyle = {
    display: 'inline-block',
    padding: '4px 16px',
    backgroundColor: 'lightGray',
  }

  return (
    <ul style={listStyle}>
      {widget.$external.routes.map((route) => {
        let itemStyle = { ...defaultItemStyle };
        if (widget.router.getCurrentRoute().name === route.name) {
          //itemStyle.backgroundColor = 'lightGray';
          itemStyle.boxShadow = '0px 2px blue';
        } 

        return <li style={itemStyle} onClick={() => widget.setProps({ pathname: widget.router.link(route.name)})}>{route.name}</li>
      })}
    </ul>
  )
}



export class SkeletonComponent extends Component {
  render() {
    const { widget } = this.props;
    return (
      <context.Provider value={widget}>
        <StickyButton widget={widget} />
        {widget.state.open && <ToolWindow widget={widget} />}
      </context.Provider>
    );
  }
}