import { EMPTY_HOOK_STATE } from "./consts";
import { isFunction } from "./utils";

let treeRenderResolver = undefined;
let treeRender = undefined;
let currentFiber = undefined;
let currentHookIndex = 0;

export const getWipHookIndex = () => currentHookIndex;
export const resetHookIndex = () => {
  currentHookIndex = -1;
};
export const gotoLastHookIndex = (fiber) => {
  currentHookIndex = fiber.hooks.length;
};
export const incHook = () => {
  currentHookIndex = currentHookIndex + 1;
  if (currentFiber.hooks.length < currentHookIndex) {
    currentFiber.hooks.push(EMPTY_HOOK_STATE);
  }
  return currentHookIndex;
};

export const setWipFiber = (fiber) => {
  currentFiber = fiber;
  resetHookIndex();
};
export const getWipFiber = () => currentFiber;

export const resetTreeRender = () => {
  treeRender = new Promise((res) => {
    treeRenderResolver = res;
  });
};

export const resolveTreeRender = () => {
  if (isFunction(treeRenderResolver)) treeRenderResolver();
};

export const getTreeRender = () => treeRender;
