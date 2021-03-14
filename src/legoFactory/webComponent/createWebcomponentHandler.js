const triggerHandlers = (handlers, propValue) => {
  for (let i = 0; i < handlers.length; i++) {
    handlers[i](propValue);
  }
};

const createWebcomponentHandler = (host) => {
  const handlers = {};
  const state = {};

  return {
    host,
    setProp: (propName, propValue) => {
      if (state[propName] === propValue) return;

      state[propName] = propValue;
      handlers[propName] = handlers[propName] || [];
      triggerHandlers(handlers[propName], propValue);
    },
    getProp: (propName) => state[propName],
    register: (propName, handler) => {
      handlers[propName] = handlers[propName] || [];
      handlers[propName].push(handler);

      return () => {
        handlers[propName] = handlers[propName].filter(
          (propHandler) => propHandler !== handler
        );
      };
    },
  };
};

export default createWebcomponentHandler;
