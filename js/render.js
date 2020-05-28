import * as dom from "./dom.js";
import {icon as svg} from "./icons.js";

/**
 * @typedef {Object} Content
 * @property {string} type
 */

/**
 * @typedef {Content} ContentRow
 * @property {Array<Content>} blocks
 */

/**
 * @typedef {Content} ContentCard
 * @property {string} class
 * @property {Object} attrs
 * @property {Content|string} header
 * @property {Content|string} body
 * @property {Content|string} title
 * @property {Content|string} footer
 */

/**
 * @typedef {Content} ContentTable
 * @property {string} class
 * @property {Object} attrs
 * @property {Array<string>} headers
 * @property {Array<Array<string>>} data
 */

/**
 * @typedef {Content} ContentText
 * @property {string} class
 * @property {Content|string} text
 */

/**
 * @typedef {Content} ContentParagraph
 * @property {string} class
 * @property {Object} attrs
 * @property {Content|string} text
 */

/**
 * @typedef {Content} ContentBlock
 * @property {string} class
 * @property {Object} attrs
 * @property {Content|string} body
 */

/**
 * @typedef {Content} ContentRaw
 * @property {string} tag
 * @property {string} class
 * @property {Object} attrs
 * @property {Content|string} body
 */

/**
 * @param {ContentRow} content
 * @return {Promise<Node>}
 */
const row = (content) => {
  let promises = [];

  if (Array.isArray(content.blocks)) {
    for (let block of content.blocks) {
      promises.push(render(block).then((frag) => {
        return dom.elem('div', {classes: 'col-auto flex-grow-1 mb-4', body: frag})
      }));
    }
  } else if (typeof content.blocks === 'object' && content.blocks.type === 'each') {
    promises.push(render(content.blocks).then((frag) => {
      const nodes = document.createDocumentFragment();
      let child;
      while ((child = frag.childNodes[0])) {
        nodes.appendChild(dom.elem('div', {classes: 'col-auto flex-grow-1 mb-4', body: child}))
      }
      return nodes;
    }));
  }

  return Promise.all(promises)
    .then((blocks) => dom.elem('div', {classes: 'row', body: blocks}));
};

/**
 * @param {ContentCard} content
 * @return {Promise<Node>}
 */
const card = (content) => {
  const card = dom.elem('div', {
    classes: ['card h-100'].concat(content.class || []),
    attrs: content.attrs
  });

  let promises = [];

  if (content.header) {
    const header = dom.elem('div', {classes: 'card-header'});

    dom.content(card, header);

    promises.push(render(content.header).then((frag) => {
      dom.content(header, frag)
    }))
  }
  if (content.body) {
    const body = dom.elem('div', {classes: 'card-body'});

    dom.content(card, body);

    const body_promises = [];

    if (content.title) {
      const title = dom.elem('div', {classes: 'card-title'});

      dom.content(body, title);

      body_promises.push(render(content.title))
    }

    body_promises.push(render(content.body));

    promises.push(Promise.all(body_promises).then((frag) => dom.content(body, frag)));
  }
  if (content.footer) {
    const footer = dom.elem('div', {classes: 'card-footer'});

    dom.content(card, footer);

    promises.push(render(content.footer).then((frag) => {
      dom.content(footer, frag)
    }));
  }

  return Promise.all(promises).then(() => card);
};

/**
 * @param {ContentTable} content
 * @return {Promise<Node>}
 */
const table = (content) => {
  const table = dom.elem('table', {
    classes: ['table'].concat(content.class || []),
    attrs: content.attrs
  });

  let promises = [];

  if (content.headers) {
    const head = dom.elem('tr');
    for (let header of content.headers) {
      head.appendChild(dom.elem('th', {body: header}))
    }
    table.appendChild(dom.elem('thead', {body: head}));
  }

  if (content.data) {
    const body = dom.elem('tbody');
    for (let datum of content.data) {
      const tr = dom.elem('tr');
      for (let val of datum) {
        const td = dom.elem('td');
        dom.content(tr, td);
        promises.push(render(val).then((frag) => {
          dom.content(td, frag);
        }))
      }
      body.appendChild(tr);
    }
    table.appendChild(body);
  }

  return Promise.all(promises).then(() => table);
};

/**
 * @param content
 * @return {Promise<Node>}
 */
const icon = (content) => {
  return svg(content.icon, content.size)
};

/**
 * @param {ContentText} content
 * @return {Promise<Node>}
 */
const text = (content) => {
  return render(content.text).then((frag) => dom.elem('span', {
    classes: content.class,
    body: frag
  }))
};

/**
 * @param {ContentParagraph} content
 * @return {Promise<Node>}
 */
const paragraph = (content) => {
  return render(content.text).then((frag) => dom.elem('p', {
    classes: content.class,
    attrs: content.attrs,
    body: frag
  }))
};

/**
 * @param {ContentBlock} content
 * @return {Promise<Node>}
 */
const block = (content) => {
  return render(content.body).then((frag) => dom.elem('div', {
    classes: content.class,
    attrs: content.attrs,
    body: frag
  }))
};

const input = (content) => {
  return Promise.resolve(dom.elem('input', {
    classes: 'form-control ' + (content.class || ''),
    attrs: Object.assign({}, content.attrs, {
      type: content.input_type || 'text',
      name: content.name,
      placeholder: content.placeholder
    })
  }))
};

const store = (content) => {
  return render(content.body).then((frag) => dom.elem('div', {
    classes: "store",
    attrs: {id: content.id},
    body: frag
  }));
};

/**
 * @param {ContentRaw} content
 * @return {Promise<Node>}
 */
const raw = (content) => {
  return render(content.body).then((frag) => dom.elem(content.tag, {
    classes: content.class,
    attrs: content.attrs,
    body: frag
  }))
};

const _recurse_replace = (elem, replacements) => {
  if (typeof elem === "string") {
    for (let key in replacements) {
      elem = elem.replace(new RegExp(':' + key + ':', 'g'), replacements[key]);
    }

    return elem;
  }
  if (Array.isArray(elem)) {
    const shadow = [];

    for (let item of elem) {
      shadow.push(_recurse_replace(item, replacements))
    }

    return shadow;
  }
  if (typeof elem === 'object') {
    const shadow = {};

    for (let key in elem) {
      shadow[key] = _recurse_replace(elem[key], replacements);
    }

    return shadow;
  }

  return elem;
};

const _for = (content) => {
  const promises = [];

  for (let i = 0; i < content.number; i++) {
    promises.push(render(_recurse_replace(content.each, {index: i})))
  }

  return Promise.all(promises).then((nodes) => {
    const frag = document.createDocumentFragment();
    dom.content(frag, nodes);
    return frag;
  })
};

const _each = (content) => {
  const promises = [];

  for (let item of content.data) {
    promises.push(render(_recurse_replace(content.each, item)))
  }


  return Promise.all(promises).then((nodes) => {
    const frag = document.createDocumentFragment();
    dom.content(frag, nodes);
    return frag;
  })
};

let templates = {};

export const load_templates = (data) => {
  templates = data;
};

const _template = (content) => {
  return render(_recurse_replace(templates[content.id], content.data))
};

/**
 * @param content
 *
 * @return {Promise<Node>}
 */
const render = (content) => {
  if (content == null) {
    return Promise.resolve(document.createDocumentFragment())
  }
  if (Array.isArray(content)) {
    const frag = document.createDocumentFragment();
    let promises = [];
    for (let item of content) {
      promises.push(render(item))
    }

    return Promise.all(promises)
      .then((nodes) => dom.content(frag, nodes))
      .then(() => frag);
  }

  switch (typeof content) {
    case "number":
    case "string":
      return Promise.resolve(document.createTextNode(content));
  }

  switch (content.type) {
    case 'for':
      return _for(content);
    case 'each':
      return _each(content);
    case 'template':
      return _template(content);
    case 'row':
      return row(content);
    case 'card':
      return card(content);
    case 'table':
      return table(content);
    case 'icon':
      return icon(content);
    case 'div':
    case 'block':
      return block(content);
    case 'span':
    case 'text':
      return text(content);
    case 'p':
    case 'paragraph':
      return paragraph(content);
    case 'store':
      return store(content);
    case 'input':
      return input(content);
    case 'raw':
      return raw(content)
  }
};

export default render;
