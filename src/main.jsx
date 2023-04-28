import { createSPAWidget } from './merkur-spa';

import { widget } from './skeleton/widget';

if (typeof document !== undefined) {
  if (document.readyState !== 'loading') {
    createSPAWidget(widget);
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      createSPAWidget(widget);
    });
  }
}

