import { getMerkur, createMerkurWidget } from '@merkur/core';
import { componentPlugin } from '@merkur/plugin-component';
import { eventEmitterPlugin } from '@merkur/plugin-event-emitter';

export function createSPAWidget(properties) {
  const widgetProperties = {
    ...properties,
    props: properties.props ?? {},
    state: properties.state ?? {},
    $plugins: [
      componentPlugin,
      eventEmitterPlugin,
      ...(properties.$plugins ?? []),
    ],
    $dependencies: properties.$dependencies ?? {},
    createWidget: createMerkurWidget,
  };

  getMerkur().register(widgetProperties);
  return getMerkur()
    .create(widgetProperties)
    .then(function (widget) {
      return widget.mount();
    })
    .catch((error) => {
      console.error(error);
    });
}
