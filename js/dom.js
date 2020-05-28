/**
 * @param {string} id
 * @return {HTMLElement}
 */
export const id = (id) => document.getElementById(id);

/**
 *
 * @param {string} selector
 * @param {Element} [element]
 * @return {HTMLElement}
 */
export const query = (selector, element = null) => (element || document).querySelector(selector);

/**
 * @param {string} selector
 * @param {Element} [element]
 * @return {NodeListOf<HTMLElementTagNameMap[*]>|Array<HTMLElement>}
 */
export const query_all = (selector, element = null) => (element || document).querySelectorAll(selector);

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

export const add_class = (elem, classes) => {
  if (typeof classes === 'string') {
    classes = [classes]
  }

  for (let c of classes) {
    elem.classList.add(...(c.trim().split(" ")));
  }
};

export const remove_class = (elem, classes) => {
  if (typeof classes === 'string') {
    classes = [classes]
  }

  for (let c of classes) {
    elem.classList.remove(...(c.trim().split(" ")));
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
    add_class(elem, classes);
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
 * @param {string|Array<string>} type
 * @param {string|Array<string>} selector
 * @param {function(Event, Element)} callback
 */
export const add_delegate_event = (elem, type, selector, callback) => {
  if (typeof selector === 'string') {
    selector = selector.split(',').map(value => value.trim());
  }

  if (typeof type === 'string') {
    type = type.split(',').map(value => value.trim());
  }

  for (let t of type) {
    add_event(elem, t, (event) => {
      let target = (/** @type {Element} */event.target);

      while (target !== elem && !target.isSameNode(document)) {
        for (let s of selector) {
          if (target.matches(selector)) {
            if (target.disabled === true) {
              return;
            }

            return callback.call(this, event, target)
          }
        }

        target = target.parentNode;
      }
    })
  }
};
