/**
 * @param {string} id
 * @return {HTMLElement}
 */
export const id = (id) => document.getElementById(id);

/**
 * @param {string} selector
 * @return {NodeListOf<HTMLElementTagNameMap[*]>|Array<HTMLElement>}
 */
export const query = (selector) => document.querySelectorAll(selector);

export const empty = (elem) => {
  const nodes = elem.childNodes;
  let n = nodes.length;

  while (n) {
    elem.removeChild(nodes[0]);
    n--;
  }
};

export const content = (elem, data) => {
  if (data instanceof Node) {
    elem.appendChild(data);
    return
  }
  if (data instanceof NodeList) {
    for (let node of data) {
      elem.appendChild(node)
    }
    return
  }
  if (Array.isArray(data)) {
    for (let datum of data) {
      content(elem, datum)
    }
    return
  }
  if (data) {
    elem.appendChild(document.createTextNode(data))
  }
};

const dom_cache = {};
/**
 * @param tag
 * @param classes
 * @param attrs
 * @param body
 * @return {Node}
 */
export const elem = (tag, {classes, attrs, body} = {}) => {
  if (!dom_cache[tag]) {
    dom_cache[tag] = document.createElement(tag);
  }

  const elem = dom_cache[tag].cloneNode(true);

  if (classes) {
    if (typeof classes === 'string') {
      classes = [classes]
    }

    for (let c of classes) {
      elem.classList.add(...(c.split(" ")));
    }
  }
  if (attrs) {
    for (let attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        elem.setAttribute(attr, attrs[attr]);
      }
    }
  }
  if (body) {
    content(elem, body)
  }

  return elem;
};

/**
 * @param {Element} elem
 * @param {string} type
 * @param {function(Event)} callback
 */
export const add_event = (elem, type, callback) => {
  elem.addEventListener(type, callback, false);
};
/**
 * @param {Element} elem
 * @param {string} type
 * @param {string} selector
 * @param {function(Event, Element)} callback
 */
export const add_delegate_event = (elem, type, selector, callback) => {
  add_event(elem, type, (event) => {
    let target = (/** @type {Element} */event.target);

    while (target !== elem && !target.isSameNode(document)) {
      if (target.matches(selector)) {
        return callback.call(this, event, target)
      }

      target = target.parentNode;
    }
  })
};
