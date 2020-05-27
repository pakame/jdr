import {query_all} from "./dom.js";
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

export const icon = (name, size) => {
  return svg(name)
    .then((icon) => parse(icon))
    .then((icon) => {
      if (size) {
        icon.firstElementChild.classList.add('fa-' + size)
      }

      return icon
    })
};

export const auto = () => {
  const promises = [];

  for (let elem of query_all('.svg-load')) {
    const name = elem.dataset['name'];
    const size = elem.dataset['size'];
    promises.push(svg(name).then((icon) => {
      icon = parse(icon);

      if (size) {
        icon.children[0].classList.add('fa-' + size);
      }

      elem.parentNode.replaceChild(icon, elem);
    }))
  }

  return Promise.all(promises)
};
