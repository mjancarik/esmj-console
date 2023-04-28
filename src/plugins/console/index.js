import { aop, hookName, createHook } from 'to-aop';

function routeFactory({ widget }) {
  return {
    view: () => (<pre>{
      JSON.stringify(
        widget.state,
        0,
        4
      )
    }</pre>),
    async load() {
      return {
        ...widget.$in.console.state,
      };
    },
  };
}


export function consolePlugin() {
  return {
    async setup(widget) {
      widget.$in.console = {
        state: {
          console: {
            records: [],
          },
        },
        console: window.console,
      };

      const consoleAfterHook = createHook(
        hookName.afterMethod,
        /.*/,
        ({ property, args }) => {
          if (property === 'debug') {
            return null;
          }
          widget.$in.console.state.console.records.push({
            type: property,
            args,
          });

          widget.state.console &&
            widget.setState({ ...widget.$in.console.state });
        }
      );

      window.console = aop(window.console, consoleAfterHook);

      widget.$external.routes.push({
        name: 'console',
        path: '/',
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
