/** @jsxRuntime classic */
/** @jsx createElement */

import { getAttrs, getProps } from "./utils";
import { render, createElement } from "../index";
import WebcomponentContext from "./webcomponentContext";
import createWebcomponentHandler from "./createWebcomponentHandler";

const createShadowRoow = (node) => {
  return node.attachShadow({ mode: "open" });
};

const createCustomElement = (
  Component,
  { base = HTMLElement, shadowRoot = false } = {}
) => {
  const propTypes = Component.propTypes || {}; // eslint-disable-line react/forbid-foreign-prop-types

  const attrs = getAttrs(propTypes);

  const props = getProps(propTypes);

  const propsValues = Object.keys(propTypes).reduce((values, prop) => {
    return {
      ...values,
      [prop]: propTypes[prop].initialValue,
    };
  }, {});

  class Element extends base {
    static get observedAttributes() {
      return attrs;
    }

    constructor() {
      super();

      this.webcomponentHandler = createWebcomponentHandler(this);

      props.forEach((prop) => {
        Object.defineProperty(this, prop, {
          set(newValue) {
            propsValues[prop] = newValue;
            this.webcomponentHandler.setProp(prop, newValue);
          },
          get() {
            return propsValues[prop];
          },
        });
      });

      if (shadowRoot) {
        createShadowRoow(this);
      }

      Object.keys(propTypes).forEach((prop) => {
        this.webcomponentHandler.setProp(prop, propsValues[prop]);
      });
    }

    attributeChangedCallback(name, oldValue, newValue) {
      const convertedValue =
        propTypes[name].type === Boolean
          ? newValue === ""
            ? true
            : newValue === "true"
            ? true
            : false
          : propTypes[name].type === Number
          ? parseFloat(newValue)
          : newValue;
      this.webcomponentHandler.setProp(name, convertedValue);
    }

    connectedCallback() {
      render(
        <WebcomponentContext.Provider value={this.webcomponentHandler}>
          <Component />
        </WebcomponentContext.Provider>,
        this.shadowRoot ? this.shadowRoot : this
      );
    }
  }

  return Element;
};

export default createCustomElement;
