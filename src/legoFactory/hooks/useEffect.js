import {
  isUndefined,
  isArray,
  isFunction,
  registerFiberHandler,
  isSimilar,
} from "../utils";
import hookState, { getFiber } from "./hookState";

const registerNoDepsHandlers = (fiber, handler) => {
  registerFiberHandler(fiber, "render", () => {
    const removeHandler = handler();

    registerFiberHandler(fiber, "willUpdate", removeHandler);
    registerFiberHandler(fiber, "willRemove", removeHandler);
  });
};

const registerDepsHandlers = (fiber, handler, deps) => {
  const [depsState, setDepsState] = hookState(fiber, undefined);
  const [removeHandlerState, setRemoveHandlerState] = hookState(
    fiber,
    () => {}
  );

  registerFiberHandler(fiber, "render", () => {
    if (!isSimilar(deps, depsState)) {
      if (isFunction(removeHandlerState)) {
        removeHandlerState();
      }
      setDepsState(deps);

      const removeHandler = handler();

      setRemoveHandlerState(removeHandler);
      registerFiberHandler(fiber, "willRemove", removeHandler);
    }
  });
};

const useEffect = (handler, deps) => {
  const fiber = getFiber();

  if (isUndefined(deps)) {
    registerNoDepsHandlers(fiber, handler);
  }

  if (isArray(deps)) {
    registerDepsHandlers(fiber, handler, deps);
  }
};

export default useEffect;
