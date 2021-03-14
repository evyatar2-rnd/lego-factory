import Reconciler from "./reconciler/index";
import {
  isUndefined,
  isFunction,
  isTextElement,
  isFunctionComponent,
  getType,
  getComponentProps,
  setFiberContext,
  resetFiberHandlers,
  isArray,
  triggerFiberHandlers,
  getKey,
  getSiblingWithKey,
  findNode,
} from "./utils";
import {
  setWipFiber,
  resetTreeRender,
  getTreeRender,
  resolveTreeRender,
} from "./workInProgress";

const reconciler = Reconciler();

/**
 * Situtations that might happen
 *                        oVNode | nVNode | equal | sameKey | sameType
 * 1. Create                 -   |    +   |       |         |
 * 2. Update                 +   |    +   |   -   |    -    |    +
 * 3. Update                 +   |    +   |   -   |    +    |    +
 * 4. Replace                +   |    +   |   -   |    +    |    -
 * 5. Replace                +   |    +   |   -   |    -    |
 * 6. Remove                 +   |    -   |       |         |
 * 7. Remove                 +   |    +   |   -   |    -    |
 * 8. Memoized               +   |    +   |   +   |         |
 */

const vTrees = new Map();

const createInstance = (vNode) => {
  const node = isTextElement(vNode)
    ? reconciler.createTextInstance(vNode.props.nodeValue)
    : reconciler.createInstance(vNode);

  reconciler.updateInstance(node, undefined, vNode);

  return node;
};

const updateInstance = (nVNode, oVNode) => {
  if (!isUndefined(oVNode)) {
    nVNode.node = oVNode.node;
  }

  reconciler.updateInstance(nVNode.node, oVNode, nVNode);

  if (!isUndefined(nVNode.ref)) {
    if (isFunction(nVNode.ref)) {
      nVNode.ref(nVNode.node);
    } else {
      nVNode.ref.current = nVNode.node;
    }
  }

  return nVNode.node;
};

const removeInstance = (vNode) => {
  reconciler.remove(vNode);
};

const appendChildInstance = (parentNode, childNode) => {
  if (isUndefined(childNode)) return;

  reconciler.appendChild(parentNode, childNode);
};

const appendChildrenInstances = (parentNode, childrenNodes) => {
  for (let i = 0; i < childrenNodes.length; i++) {
    appendChildInstance(parentNode, childrenNodes[i]);
  }
};

const insertBefore = (nChild, oChild) => {
  reconciler.insertBefore(oChild.parentElement, nChild, oChild);
};

const insertItemsBefore = (nChilds, oChild) => {
  for (let i = 0; i < nChilds.length; i++) {
    reconciler.insertBefore(oChild.parentElement, nChilds[i], oChild);
  }
};

const renderComponent = (vNode) => {
  const componentType = getType(vNode);
  const rendredChildren = componentType(getComponentProps(vNode.props));

  return isArray(rendredChildren) ? rendredChildren : [rendredChildren];
};

const renderChildren = (parentVNode, nVChildren = [], oVChildren = []) => {
  const nVChildrenLength = nVChildren.length;
  const oVChildrenLength = oVChildren.length;
  const maxChildrenLength = Math.max(nVChildrenLength, oVChildrenLength);

  const childNodes = [];

  for (let i = 0; i < maxChildrenLength; i++) {
    const nChild = i < nVChildrenLength ? nVChildren[i] : undefined;
    const oChild = i < oVChildrenLength ? oVChildren[i] : undefined;
    const renderedNodes = renderNode(parentVNode, nChild, oChild);

    if (isArray(renderedNodes)) {
      childNodes.push(...renderedNodes);
    } else {
      childNodes.push(renderedNodes);
    }
  }

  return childNodes;
};

const createNode = (nVNode) => {
  if (isFunctionComponent(nVNode)) {
    nVNode.children = renderComponent(nVNode);
  } else {
    nVNode.node = createInstance(nVNode);
    updateInstance(nVNode, undefined);
  }
  const children = isFunctionComponent(nVNode)
    ? nVNode.children
    : nVNode.props.children;
  const childNodes = renderChildren(nVNode, children, undefined);

  if (isUndefined(nVNode.node)) {
    return childNodes;
  }

  appendChildrenInstances(nVNode.node, childNodes);
  return nVNode.node;
};

const removeChildren = (vChildren) => {
  for (let i = 0; i < vChildren.length; i++) {
    removeNode(vChildren[i]);
  }
};

const removeNode = (vNode) => {
  if (isFunctionComponent(vNode)) {
    removeChildren(vNode.children);
  } else {
    removeChildren(vNode.props.children);
    removeInstance(vNode.node);
  }
};

const updateNode = (nVNode, oVNode) => {
  nVNode.node = oVNode.node;
  nVNode.state = oVNode.state;
  nVNode.hooks = oVNode.hooks;

  if (!isFunctionComponent(nVNode)) {
    updateInstance(nVNode, oVNode);
  }

  const nChildren = isFunctionComponent(nVNode)
    ? renderComponent(nVNode)
    : nVNode.props.children;
  const oChildren = isFunctionComponent(oVNode)
    ? oVNode.children
    : oVNode.props.children;
  const childNodes = renderChildren(nVNode, nChildren, oChildren);

  nVNode.children = nChildren;

  if (isUndefined(nVNode.node)) {
    return childNodes;
  }

  appendChildrenInstances(nVNode.node, childNodes);

  return nVNode.node;
};

const renderNode = (parentNVNode, nVNode, oVNode) => {
  if (isUndefined(nVNode) && isUndefined(oVNode)) {
    return;
  }

  if (isUndefined(nVNode)) {
    removeNode(oVNode);
    return;
  }

  nVNode.parent = parentNVNode;
  setWipFiber(nVNode);
  setFiberContext(parentNVNode, nVNode);
  resetFiberHandlers(nVNode);

  if (!isUndefined(nVNode) && isUndefined(oVNode)) {
    triggerFiberHandlers(nVNode, "created");
    getTreeRender().then(() => {
      triggerFiberHandlers(nVNode, "render");
    });
    return createNode(nVNode);
  }

  if (nVNode === oVNode) {
    if (nVNode.shouldUpdate || nVNode.parent.shouldUpdate) {
      triggerFiberHandlers(oVNode, "willUpdate");
      getTreeRender().then(() => {
        triggerFiberHandlers(nVNode, "render");
      });

      const parentNode = nVNode.isRoot
        ? nVNode.getContainingNode()
        : parentNVNode.getContainingNode();
      const nodesToAdd = updateNode(nVNode, oVNode);

      appendChildrenInstances(parentNode, nodesToAdd);

      nVNode.shouldUpdate = false;
    }

    return;
  }

  if (getType(nVNode) === getType(oVNode)) {
    if (getKey(nVNode) === getKey(oVNode)) {
      triggerFiberHandlers(oVNode, "willUpdate");
      getTreeRender().then(() => {
        triggerFiberHandlers(nVNode, "render");
      });

      updateNode(nVNode, oVNode);

      return;
    }
  }

  // replace
  if (getKey(nVNode) === getKey(oVNode) || isUndefined(getKey(nVNode))) {
    const newNodes = createNode(nVNode);
    const oNode = findNode(oVNode);

    if (isUndefined(oNode)) {
      return newNodes;
    }

    if (isArray(newNodes)) {
      insertItemsBefore(newNodes, oNode);
    } else {
      insertBefore(newNodes, oNode);
    }

    triggerFiberHandlers(nVNode, "created");
    getTreeRender().then(() => {
      triggerFiberHandlers(nVNode, "render");
    });

    if (
      isUndefined(getKey(oVNode)) ||
      isUndefined(getSiblingWithKey(nVNode, getKey(oVNode)))
    ) {
      getTreeRender().then(() => {
        triggerFiberHandlers(oVNode, "willRemove");
      });
      removeNode(oVNode);
    }
    return;
  }

  //if nVNode has old child with same key then move that child before oVNode
  //else create new child before oVNode
  const oVNodeWithSameKey = getSiblingWithKey(oVNode);
  if (!isUndefined(oVNodeWithSameKey)) {
    triggerFiberHandlers(oVNodeWithSameKey, "willUpdate");
  }
  if (isUndefined(oVNodeWithSameKey)) {
    triggerFiberHandlers(nVNode, "created");
    getTreeRender().then(() => {
      triggerFiberHandlers(nVNode, "render");
    });
  }

  const newNodes = !isUndefined(oVNodeWithSameKey)
    ? updateNode(nVNode, oVNodeWithSameKey)
    : createNode(nVNode);
  const oNode = findNode(oVNode);

  if (isUndefined(oNode)) {
    return newNodes;
  }

  if (isArray(newNodes)) {
    insertItemsBefore(newNodes, oNode);
  } else {
    insertBefore(newNodes, oNode);
  }

  //if oVNode as no new child with same key then remove oVNode
  if (
    isUndefined(getKey(oVNode)) ||
    isUndefined(getSiblingWithKey(nVNode, getKey(oVNode)))
  ) {
    getTreeRender().then(() => {
      triggerFiberHandlers(oVNode, "willRemove");
    });
    removeNode(oVNode);
  }
};

export const reRenderNode = (vNode) => {
  resetTreeRender();

  vNode.shouldUpdate = true;
  if (vNode.isRoot) {
    render(vNode, vNode.rootNode);
  } else {
    renderNode(vNode.parent, vNode, vNode);
  }

  resolveTreeRender();
  resetTreeRender();
};

/**
 * render
 * @param {VNode} vtree
 * @param {DOMNode} containerNode
 *
 * Renders the virtual tree of typ VNode to the containerNode
 */
const render = (vTree, containerNode, cb) => {
  resetTreeRender();

  vTree.isRoot = true;
  vTree.rootNode = containerNode;

  const nodes = renderNode(
    undefined,
    vTree,
    vTrees.get(containerNode),
    containerNode
  );

  if (isArray(nodes)) {
    appendChildrenInstances(containerNode, nodes);
  } else {
    appendChildInstance(containerNode, nodes);
  }

  vTrees.set(containerNode, vTree);

  resolveTreeRender();
  resetTreeRender();

  if (isFunction(cb)) {
    cb();
  }
};

/**
 * unmountComponentAtNode
 * @param {DOMNode} containerNode
 *
 * If there is a vTree belongs to the containerNode it is unmounted and removed from the vTrees
 */
export const unmountComponentAtNode = (containerNode) => {
  if (!vTrees.has(containerNode)) return;

  vTrees.delete(containerNode);
};

export default render;
