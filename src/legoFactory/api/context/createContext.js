import { isUndefined } from "../../utils";
import { getFiber } from "../../hooks/hookState";

const createContext = (initialValue) => {
  const contextSymbol = Symbol();

  return {
    Provider: ({ value, children }) => {
      const fiber = getFiber();

      if (isUndefined(fiber.context)) {
        fiber.context = new Map();
        fiber.context.set(
          contextSymbol,
          isUndefined(value) ? initialValue : value
        );
      }

      if (!isUndefined(value) && value !== fiber.context.get(contextSymbol)) {
        fiber.context.set(contextSymbol, value);
      }

      return children;
    },

    getStateValue: () => {
      const fiber = getFiber();

      if (isUndefined(fiber.context)) {
        fiber.context = new Map();
      }
      if (isUndefined(fiber.context.get(contextSymbol))) {
        fiber.context.set(contextSymbol, initialValue);
      }

      return fiber.context.get(contextSymbol);
    },
  };
};

export default createContext;
