import { getMerkur, createMerkurWidget } from '@merkur/core';
import { loadAssets } from '@merkur/integration';

export async function createSPAWidget(properties) {
  const widgetProperties = {
    ...properties,
    createWidget: createMerkurWidget,
  };

  getMerkur().register(widgetProperties);

  await loadAssets(widgetProperties.assets);

  await new Promise((resolve) => {
    if (typeof document !== 'undefined') {
      if (document.readyState !== 'loading') {
        resolve();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          resolve();
        });
      }
    }
  });

  return await getMerkur().create(widgetProperties);
}
