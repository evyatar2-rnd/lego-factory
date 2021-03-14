import { EMPTY_HOOK_STATE } from "../consts";
import { isUndefined, isSimilar, isFunction } from "../utils";
import hookState, { getFiber } from "./hookState";

const setHandlers = (node, handlers) => {
  Object.keys(handlers).forEach((handlerName) => {
    node[handlerName] = handlers[handlerName];
  });
};

const useImperativeHandle = (ref, handlers, deps) => {
  const fiber = getFiber();
  const [depsState, setDepsState] = hookState(fiber, EMPTY_HOOK_STATE);

  if (depsState === EMPTY_HOOK_STATE || !isSimilar(deps, depsState)) {
    setDepsState(deps);

    if (isUndefined(ref) || isUndefined(ref.current) || !isFunction(handlers))
      return;

    setHandlers(ref.current, handlers());

    return;
  }
};

export default useImperativeHandle;
