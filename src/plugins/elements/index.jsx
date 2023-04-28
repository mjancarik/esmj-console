import Dom from "./components/dom/Dom.jsx";

function routeFactory({ widget }) {
  return {
    view: () => (<Dom/>),
    async load() {
      return {
        ...widget.$in.elements.state,
      };
    },
  };
}


export function elementsPlugin() {
  return {
    async setup(widget) {
      widget.$in.elements = {
        state: {
          elements: document.documentElement,
        }
      };

      widget.$external.routes.push({
        name: 'elements',
        path: '/elements',
        action: (args) => {
          return { ...args.route, ...routeFactory(args) };
        },
      });

      return widget;
    },
    async create(widget) {
      return widget;
    },
  };
}
