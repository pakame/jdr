import * as dom from "./dom.js";

const row = (content) => {
  const blocks = document.createDocumentFragment();

  for (let block of content.blocks) {
    blocks.appendChild(dom.elem('div', {classes: 'col-auto flex-grow-1 mt-4', body: render(block)}));
  }

  return dom.elem('div', {classes: 'row', body: blocks});
};

const card = (content) => {
  const card = dom.elem('div', {
    classes: ['card h-100'].concat(content?.class || []),
    attrs: content.attrs
  });

  if (content.header) {
    card.appendChild(dom.elem('div', {classes: 'card-header', body: render(content.header)}))
  }
  if (content.body) {
    const body = dom.elem('div', {classes: 'card-body'});
    if (content.title) {
      body.appendChild(dom.elem('div', {classes: 'card-title', body: render(content.title)}))
    }
    body.appendChild(render(content.body));
    card.appendChild(body)
  }
  if (content.footer) {
    card.appendChild(dom.elem('div', {classes: 'card-footer', body: render(content.footer)}))
  }

  return card;
};

const table = (content) => {
  const table = dom.elem('table', {
    classes: ['table small'].concat(content.class || []),
    attrs: content.attrs
  });

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
        tr.appendChild(dom.elem('td', {body: render(val)}));
      }
      body.appendChild(tr);
    }
    table.appendChild(body);
  }

  return table;
};

const text = (content) => {
  return dom.elem('span', {
    classes: content.class,
    body: render(content.text)
  })
};

const paragraph = (content) => {
  return dom.elem('p', {
    classes: content.class,
    attrs: content.attrs,
    body: render(content.text)
  })
};

const block = (content) => {
  return dom.elem('div', {
    classes: content.class,
    attrs: content.attrs,
    body: render(content.body)
  })
};

const raw = (content) => {
  return dom.elem(content.tag, {
    classes: content.class,
    attrs: content.attrs,
    body: render(content.body)
  })
};

/**
 * @param content
 *
 * @return {Node}
 */
const render = (content) => {
  if (Array.isArray(content)) {
    const frag = document.createDocumentFragment();

    for (let item of content) {
      frag.appendChild(render(item));
    }

    return frag;
  }

  switch (typeof content) {
    case "number":
    case "string":
      return document.createTextNode(content);
  }

  switch (content.type) {
    case 'row':
      return row(content);
    case 'card':
      return card(content);
    case 'table':
      return table(content);
    case 'div':
    case 'block':
      return block(content);
    case 'span':
    case 'text':
      return text(content);
    case 'p':
    case 'paragraph':
      return paragraph(content);
    case 'raw':
      return raw(content)
  }
};

export default render;
