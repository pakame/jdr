import * as dom from "./dom.js"

export const show = () => {
  dom.id('loader').style.display = null;
};

export const hide = () => {
  dom.id('loader').style.display = 'none';
};
