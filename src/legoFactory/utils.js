import { ELEMENT_TYPE, TEXT_ELEMENT, INPUT_TAG_NAME } from "./consts";

export const isUndefined = (o) => typeof o === "undefined";
export const isNull = (o) => o === null;
export const isFalse = (o) => o === false;
export const isObject = (o) => typeof o === "object";
export const isFunction = (o) => typeof o === "function";
export const isArray = (o) => Array.isArray(o);
export const isString = (o) => typeof o === "string";
export const isEvent = (key) => key.startsWith("on");
export const isElement = (o) => isObject(o) && o.$$type === ELEMENT_TYPE;
export const isTextElement = (o) => isElement(o) && o.type === TEXT_ELEMENT;
export const isProperty = (key) => key !== "children" && !isEvent(key);
export const isRefProperty = (key) => key === "ref";
export const isNewProperty = (prevProps, nextProps) => (key) =>
  prevProps[key] !== nextProps[key];
export const isNewEvent = (prevProps, nextProps) => (key) =>
  prevProps[key] !== nextProps[key];
export const isFunctionComponent = (fiber) =>
  fiber && fiber.type instanceof Function;
export const toEventName = (propName) => propName.toLowerCase().substring(2);
// The flat function is written like so, for better performance
export const flat = (
  parent,
  arr,
  flatten = [],
  keysMap = new Map(),
  indexInParent = 0
) => {
  for (let i = 0; i < arr.length; i++) {
    if (isArray(arr[i])) {
      flat(parent, arr[i], flatten, keysMap);
      continue;
    } else if (isObject(arr[i]) && arr[i].$$type === ELEMENT_TYPE) {
      arr[i].index = indexInParent++;
      arr[i].parent = parent;
      arr[i].rootNode = parent.rootNode;

      if (!isUndefined(arr[i].key)) {
        keysMap.set(arr[i].key, arr[i]);
      }
    }
    if (!isUndefined(arr[i]) && !isNull(arr[i]) && !isFalse(arr[i])) {
      flatten.push(arr[i]);
    }
  }
  return { flatten, keysMap };
};
export const getComponentProps = (props) => {
  return {
    ...props,
    children: props.children.length === 1 ? props.children[0] : props.children,
  };
};
export const isStylePropperty = (key) => key === "style";
export const toStrStyle = (style) =>
  Object.entries(style)
    .map(
      ([key, value]) =>
        `${key.replace(
          /[A-Z][a-z]*/g,
          (str) => "-" + str.toLowerCase()
        )}: ${value}`
    )
    .join("; ");
export const getType = (fiber) => fiber.type;
export const hasSameType = (fiber, prevFiber) => {
  if (!isUndefined(fiber) && isUndefined(prevFiber)) return false;
  if (isUndefined(fiber) && !isUndefined(prevFiber)) return false;
  if (getType(fiber) !== getType(prevFiber)) return false;

  return true;
};
export const hasKey = (fiber) =>
  isUndefined(fiber) || isUndefined(fiber.key) ? false : true;
export const getKey = (fiber) => fiber.key;
export const hasSameKey = (fiber, prevFiber) => {
  if (!isUndefined(fiber) && isUndefined(prevFiber)) return false;
  if (isUndefined(fiber) && !isUndefined(prevFiber)) return false;
  if (getKey(fiber) !== getKey(prevFiber)) return false;

  return true;
};
export const getSiblingWithKey = (fiber, key) => {
  if (fiber && fiber.parent && fiber.parent.childrenKeys) {
    return fiber.parent.childrenKeys.get(key);
  }

  return undefined;
};
export const getChildrenByKey = (fiber, key) => {
  if (fiber && fiber.childrenKeys) {
    return fiber.childrenKeys.get(key);
  }

  return undefined;
};
export const getPrevFiber = (fiber, prev) => {
  const key = getKey(fiber || {});
  const prevKey = getKey(prev || {});

  if (isUndefined(fiber)) return prev;
  //If keys are equal, event if both of them are undefined
  if (key === prevKey) return prev;
  if (isUndefined(key) && !isUndefined(prevKey)) return undefined;

  return getSiblingWithKey(prev, key);
};
export const triggerFiberHandlers = (fiber, handlerName) => {
  if (fiber && fiber.handlers && isArray(fiber.handlers[handlerName])) {
    fiber.handlers[handlerName].forEach((handler) => handler(fiber));
  }
};
export const registerFiberHandler = (fiber, handlerName, handler) => {
  if (fiber && fiber.handlers && isArray(fiber.handlers[handlerName])) {
    fiber.handlers[handlerName].push(handler);
  }

  return () => {
    const handlerIndex = fiber.handlers[handlerName].findIndex(
      (fiberHandler) => fiberHandler === handler
    );

    fiber.handlers[handlerName].splice(handlerIndex, 1);
  };
};

export const setFiberContext = (parent, fiber) => {
  if (isUndefined(parent) || isUndefined(fiber)) return;

  fiber.context = parent.context;
};
export const resetFiberHandlers = (fiber) => {
  if (!isElement(fiber)) return;

  fiber.handlers = {
    created: [],
    render: [],
    willUpdate: [],
    willRemove: [],
  };
};
export const updateRef = (ref, node) => {
  if (isObject(ref)) {
    ref.current = node;
  }
  if (isFunction(ref)) {
    ref(node);
  }
};
export const isSimilar = (arr1, arr2) => {
  if (!isArray(arr1) || !isArray(arr2)) return false;

  if (arr1.length !== arr2.length) return false;

  for (var index = 0; index < arr1.length; index++) {
    if (arr1[index] !== arr2[index]) {
      return false;
    }
  }

  return true;
};

export const findNode = (fiber) => {
  if (fiber.node) return fiber.node;

  if (isArray(fiber.children)) {
    for (let i = 0; i < fiber.children.length; i++) {
      const node = findNode(fiber.children[i]);
      if (!isUndefined(node)) return node;
    }
  }

  return undefined;
};

export const isInputNode = (node) => {
  return node.tagName === INPUT_TAG_NAME;
};

export const isValueProp = (prop) => prop === "value";
