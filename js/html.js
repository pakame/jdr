export const parse = (html) => {
  const div = document.createElement('div');

  div.innerHTML = html;

  const frag = document.createDocumentFragment();

  for (let node of div.childNodes) {
    frag.appendChild(node);
  }

  return frag;
};

export const stringify = (elem) => {
  const div = document.createElement('div');

  div.appendChild(elem.cloneNode(true));

  return div.innerHTML;
};
