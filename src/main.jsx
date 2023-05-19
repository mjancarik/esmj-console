import { createSPAWidget } from './merkur-spa';

import { widgetProperties } from './skeleton/widget';

(async () => {
  try {
    var __ESMJ_CONSOLE__ = {
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

    const widget = await createSPAWidget(widgetProperties);
    widget.mount();
  } catch (error) {
    console.error(error);
  }
})();
