import { EMPTY_HOOK_STATE } from "../consts";
import { getWipFiber, incHook } from "../workInProgress";
// import { renderFiber } from "../vdom";
import { reRenderNode } from "../render";

export const getFiber = getWipFiber;

export const getHookIndex = incHook;

export const getHookState = (fiber, hookIndex, initialValue) => {
  const hooks = fiber.hooks;

  if (hooks.length < hookIndex + 1) {
    hooks.push(initialValue);
  }

  if (hooks[hookIndex] === EMPTY_HOOK_STATE) {
    hooks[hookIndex] = initialValue;
  }

  return hooks[hookIndex];
};

export const setHookState = (fiber, hookIndex, value) => {
  fiber.hooks[hookIndex] = value;
};

const hookState = (fiber, initialValue) => {
  const hookIndex = getHookIndex();
  const hookState = getHookState(fiber, hookIndex, initialValue);

  return [
    hookState,
    (newValue, shouldRender = false) => {
      setHookState(fiber, hookIndex, newValue);

      if (shouldRender) {
        setTimeout(() => {
          // renderFiber(fiber);
          reRenderNode(fiber);
        }, 0);
      }
    },
  ];
};

export default hookState;
