import {id} from "./dom.js";
import {stringify} from "./html.js";

export const content = (template_id) => {
  const template = id(template_id);

  return document.importNode(template.content, true);
};

export const content_as_html = (template_id) => {
  const content = content(template_id);

  return stringify(content);
};
