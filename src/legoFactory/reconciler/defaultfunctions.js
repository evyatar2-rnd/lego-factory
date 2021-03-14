import { TEXT_NODE_TYPE } from "../consts";
import {
  isUndefined,
  isProperty,
  isRefProperty,
  isEvent,
  isNewProperty,
  isNewEvent,
  toEventName,
  isStylePropperty,
  toStrStyle,
  isInputNode,
  isValueProp,
} from "../utils";

const premiteveTypes = ["string", "boolean", "number"];

/**
 * createInstance
 * @param {VNode} vnode - virtual dom node
 *
 * Create a DOM node based on the vnode param
 */
export const createInstance = (vnode) => {
  const node = document.createElement(vnode.type);

  return node;
};

/**
 * createTextInstance
 * @param {String} text
 *
 * Creates a DOM text node based on the text param
 */
export const createTextInstance = (text) => {
  const node = document.createTextNode(text);

  return node;
};

/**
 * appendChild
 * @param {DOMNode} parent
 * @param {DOMNode} child
 *
 * Appends the child DOMNode to the end of the parent DOMNode
 */
export const appendChild = (parent, child) => {
  parent.appendChild(child);
};

/**
 * insertBefore
 * @param {DOMNode} parent
 * @param {DOMNode} child
 * @param {DOMNode} beforeNode
 *
 * Inserts the child DOMNode into the parent DOMNode before the reference beforeNode
 */
export const insertBefore = (parent, child, beforeNode) => {
  parent.insertBefore(child, beforeNode);
};

/**
 * updateInstance
 * @param {DOMnode} node
 * @param {VNode} oVnode
 * @param {VNode} nVnode
 *
 * Updates the node DOMNode attirbutes properties and events based on the difference between oVnode VNode and nVnode VNode
 */
export const updateInstance = (
  node,
  oVnode = { props: {} },
  nVnode = { props: {} }
) => {
  // Remove old properties and events
  for (const prop in oVnode.props) {
    if (isEvent(prop)) {
      if (
        !isUndefined(nVnode.props[prop]) &&
        !isNewEvent(oVnode.props, nVnode.props)(prop)
      )
        continue;

      const eventName = toEventName(prop);
      node.removeEventListener(eventName, oVnode.props[prop]);
    } else if (isProperty(prop)) {
      if (
        !isUndefined(nVnode.props[prop]) &&
        !isNewProperty(oVnode.props, nVnode.props)(prop)
      ) {
        continue;
      }

      const propType = typeof nVnode.props[prop];
      if (
        premiteveTypes.includes(propType) &&
        node.nodeType !== TEXT_NODE_TYPE &&
        !(isInputNode(node) && isValueProp(prop))
      ) {
        node.removeAttribute(prop);
      } else {
        if (node.hasAttribute && node.hasAttribute(prop)) {
          delete node[prop];
        } else {
          node[prop] = undefined;
        }
      }
    }
  }

  // Set new properties and events
  for (const prop in nVnode.props) {
    if (
      isNewProperty(oVnode.props, nVnode.props)(prop) &&
      isProperty(prop) &&
      !isRefProperty(prop)
    ) {
      if (isStylePropperty(prop)) {
        node[prop] = toStrStyle(nVnode.props[prop]);
      } else {
        const propType = typeof nVnode.props[prop];
        if (
          premiteveTypes.includes(propType) &&
          node.nodeType !== TEXT_NODE_TYPE &&
          !(isInputNode(node) && isValueProp(prop))
        ) {
          node.setAttribute(prop, nVnode.props[prop]);
        } else {
          node[prop] = nVnode.props[prop];
        }
      }
    }

    if (isEvent(prop) && isNewProperty(oVnode.props, nVnode.props)(prop)) {
      const eventName = toEventName(prop);

      node.addEventListener(eventName, nVnode.props[prop]);
    }
  }

  return node;
};

/**
 * removeChild
 * @param {DOMNode} parent
 * @param {DOMNode} child
 *
 * Removes the child DOMnode from the parent DOMNode
 */
export const removeChild = (parent, child) => {
  parent.removeChild(child);
};

/**
 * remove
 * @param {DOMNode} node
 *
 * Removes the node DOMNode
 */
export const remove = (node) => {
  node.remove();
};
