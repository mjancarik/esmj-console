import { consolePlugin } from '../plugins/console/';
import { elementsPlugin } from "../plugins/elements";
import { speakablePlugin } from '../plugins/speakable/';
import { routerPlugin, createRouter } from '@merkur/plugin-router';
import { render } from 'preact';
import { SkeletonComponent } from './SkeletonComponent';

export const widget = {
  name: '@merkur/console',
  version: '0.0.1',
  $plugins: [routerPlugin, consolePlugin, speakablePlugin, elementsPlugin],
  $external: {
    routes: [],
  },
  props: {
    pathname: '/speakable',
    open: true,
    },
  create(widget) {
    createRouter(widget, widget.$external.routes);
    const container = document.createElement('div');
    container.style = `position: fixed; z-index: 10000; width: 100%;`;
    widget.$external.container = container;
    widget.$external.buttonSize = 36;

    return widget;
  },
  load(widget) {
    return {
      open: widget?.state?.open ?? widget.props.open,
    };
  },
  mount(widget) {
    document.body.appendChild(widget.$external.container);
    console.log('mount');
    this.update(widget);
  },
  unmount(widget) {
    // TODO
  },
  update(widget) {
    const { style } = widget.$external.container;
    if (widget.state.open) {
      style.setProperty('left', '0');
      style.setProperty('top', '0');
      style.setProperty('height', '100vh');
      style.setProperty('width', '100vw');
    } else {
      style.setProperty('top', `calc(100% - ${`${widget.$external.buttonSize}px`})`);
      style.setProperty('left', `calc(100% - ${`${widget.$external.buttonSize}px`})`);
      style.setProperty('height', 'auto');
      style.setProperty('height', 'auto');

    }

    render(<SkeletonComponent widget={widget} />, widget.$external.container);
  },
};
