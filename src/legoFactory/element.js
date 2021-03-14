import { ELEMENT_TYPE, TEXT_ELEMENT } from "./consts";
import { isUndefined, isObject, isFunction, flat } from "./utils";

const createTextElement = (parent, text) => {
  return {
    $$type: ELEMENT_TYPE,
    type: TEXT_ELEMENT,
    isRoot: false,
    rootNode: undefined,
    ref: undefined,
    key: undefined,
    childrenKeys: undefined,
    parent: undefined,
    getParent: function () {
      return this.parent;
    },
    getContainingNode: function () {
      if (this.isRoot) return this.rootNode;

      let parent = this.parent;

      while (
        !isUndefined(parent) &&
        isUndefined(parent.node) &&
        !parent.isRoot
      ) {
        parent = parent.parent;
      }

      return parent.node || parent.rootNode;
    },
    props: {
      nodeValue: text,
      children: [],
    },
    hooks: [],
    context: undefined,
    handlers: {
      created: [],
      render: [],
      willUpdate: [],
      didUpdate: [],
      willRemove: [],
    },
  };
};

export const createElement = (type, props, ...children) => {
  const element = {
    $$type: ELEMENT_TYPE,
    type,
    isRoot: false,
    rootNode: undefined,
    ref: props ? props.ref : undefined,
    key: props ? props.key : undefined,
    parent: undefined,
    getParent: function () {
      return this.parent;
    },
    getContainingNode: function () {
      if (this.isRoot) return this.rootNode;

      let parent = this.parent;

      while (
        !isUndefined(parent) &&
        isUndefined(parent.node) &&
        !parent.isRoot
      ) {
        parent = parent.parent;
      }

      return parent.node || parent.rootNode;
    },
    props: {
      ...props,
      children: [],
    },
    children: [],
    childrenKeysMap: undefined,
    hasChildWithKey: (key) => {
      if (isUndefined(this.childrenKeysMap)) return false;

      return this.childrenKeysMap.has(key);
    },
    renderedChildren: [],
    hooks: [],
    context: undefined,
    handlers: {
      created: [],
      render: [],
      willUpdate: [],
      didUpdate: [],
      willRemove: [],
    },
  };

  const { flatten, keysMap } = flat(element, children);

  element.props.children = flatten.map((child) =>
    isObject(child) || isFunction(child)
      ? child
      : createTextElement(element, child)
  );
  element.childrenKeysMap = keysMap;

  return element;
};
