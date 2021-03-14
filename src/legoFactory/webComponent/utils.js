export const ATTR_TYPES = [Number, String, Boolean];
export const isAttr = (type) => ATTR_TYPES.includes(type);
export const isProp = (type) => !ATTR_TYPES.includes(type);
export const getAttrs = (propTypes) =>
  Object.keys(propTypes).filter((attr) => isAttr(propTypes[attr].type));
export const getProps = (propTypes) =>
  Object.keys(propTypes).filter((attr) => isProp(propTypes[attr].type));
