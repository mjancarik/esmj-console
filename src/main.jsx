import { createSPAWidget } from './merkur-spa';

import { widgetProperties } from './skeleton/widget';

(async () => {
  try {
    const widget = await createSPAWidget(widgetProperties);
    widget.mount();
  } catch(error) {
    console.error(error);
  }
})();
