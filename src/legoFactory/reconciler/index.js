import {
  createInstance as defaultCreateInstance,
  createTextInstance as defaultCreateTextInstance,
  appendChild as defaultAppendChild,
  insertBefore as defaultInsertBefore,
  updateInstance as defaultUpdateInstance,
  removeChild as defaultRemoveChild,
  remove as defaultRemove,
} from "./defaultfunctions";

const Reconciler = ({
  createInstance = defaultCreateInstance,
  createTextInstance = defaultCreateTextInstance,
  appendChild = defaultAppendChild,
  insertBefore = defaultInsertBefore,
  updateInstance = defaultUpdateInstance,
  removeChild = defaultRemoveChild,
  remove = defaultRemove,
} = {}) => {
  return {
    createInstance,
    createTextInstance,
    appendChild,
    insertBefore,
    updateInstance,
    removeChild,
    remove,
  };
};

export default Reconciler;
