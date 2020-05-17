/**
 * @param {string} id
 * @return {HTMLElement}
 */
export const id = (id) => document.getElementById(id);

/**
 * @param {string} selector
 * @return {NodeListOf<HTMLElementTagNameMap[*]>}
 */
export const query = (selector) => document.querySelectorAll(selector);

/**
 * @param {Element} elem
 * @param {string} type
 * @param {function(Event)}callback
 */
export const add_event = (elem, type, callback) => {
  elem.addEventListener(type, callback, false);
};

export const add_delegate_event = (elem, type, selector, callback) => {
  add_event(elem, type, (event) => {
    const target = (/** @type {Element} */event.target);

    if (target.matches(selector)) {
      return callback.call(this, event)
    }
  })
};
