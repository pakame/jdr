import {query} from "./dom.js";
import {parse} from "./html.js";

const cache = {};

export const svg = (name) => {
  if (typeof cache[name] === 'string') {
    return Promise.resolve(cache[name])
  }

  if (cache[name] instanceof Promise) {
    return cache[name]
  }

  return cache[name] = fetch('svg/' + name + '.svg')
    .then((response) => response.text())
    .then((content) => cache[name] = content)
};

export const auto = () => {
  for (let elem of query('.svg-load')) {
    const name = elem.dataset['name'];
    const size = elem.dataset['size'];
    svg(name).then((icon) => {
      icon = parse(icon);

      if (size) {
        icon.children[0].classList.add('fa-' + size);
      }

      elem.parentNode.replaceChild(icon, elem);
    })
  }
};
