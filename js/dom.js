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
    let target = (/** @type {Element} */event.target);
    do {
      if (target.matches(selector)) {
        return callback.call(this, event, target)
      }

      target = target.parentNode;
    } while (target && target !== elem)

  })
};
