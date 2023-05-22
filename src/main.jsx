import { createSPAWidget } from './merkur-spa';

import { widgetProperties } from './skeleton/widget';

class ESMJConsole extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    (async () => {
      try {
        const __ESMJ_CONSOLE__ = {
          assets: [
            {
              name: 'widget.css',
              type: 'stylesheet',
              source: 'https://unpkg.com/@esmj/console@latest/dist/style.css',
            },
          ],
        };
        if (
          typeof __ESMJ_CONSOLE__ !== 'undefined' &&
          __ESMJ_CONSOLE__?.assets?.length
        ) {
          widgetProperties.assets.push(...__ESMJ_CONSOLE__.assets);
        }

        widgetProperties.root = shadow;
        const widget = await createSPAWidget(widgetProperties);
        widget.mount();
      } catch (error) {
        console.error(error);
      }
    })();
  }
}

customElements.define('esmj-console', ESMJConsole);
