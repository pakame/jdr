import * as dom from "./dom.js"

export const show = () => {
  dom.id('loader').style.display = null;
};

export const hide = () => {

  dom.id('loader').classList.add('fade-out');

  setTimeout(() => {
    const loader = dom.id('loader');

    loader.classList.remove('fade-out');
    loader.style.display = 'none';

  }, 1000);
};
