import { getMerkur, createMerkurWidget } from '@merkur/core';

export async function createSPAWidget(properties) {
  const widgetProperties = {
    ...properties,
    createWidget: createMerkurWidget,
  };

  getMerkur().register(widgetProperties);

  // TODO assets

  await new Promise((resolve) => {
    if (typeof document !== undefined) {
      if (document.readyState !== 'loading') {
        resolve();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          resolve()
        });
      }
    }
  });

  return await getMerkur().create(widgetProperties);
}
