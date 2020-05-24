import * as dom from "./dom.js";

const row = (content) => {
  const blocks = document.createDocumentFragment();

  for (let block of content.blocks) {
    blocks.appendChild(dom.elem('div', {classes: 'col-auto flex-grow-1 mt-4', body: render(block)}));
  }

  return dom.elem('div', {classes: 'row', body: blocks});
};

const card = (content) => {
  const card = dom.elem('div', {classes: ['card h-100'].concat(content?.class || [])});

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
  const table = dom.elem('table', {classes: ['table small'].concat(content?.class || [])});

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

/**
 * @param content
 *
 * @return {Node}
 */
const render = (content) => {
  switch (typeof content) {
    case "number":
    case "string":
      return document.createTextNode(content);
  }

  if (Array.isArray(content)) {
    content = {type: 'row', blocks: content}
  }

  switch (content.type) {
    case 'row':
      return row(content);
    case 'card':
      return card(content);
    case 'table':
      return table(content)
  }
};

export default render;
