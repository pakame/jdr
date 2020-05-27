import * as dom from "./dom.js"

const splash = (content, color, time = 5000) => {
  const container = dom.elem('div', {
    classes: 'splash layer bg-' + color,
    body: dom.elem('div', {
      classes: 'splash-content',
      body: content
    })
  });

  dom.content(document.body, container);

  setTimeout(() => {

    container.classList.add('fade-out');

    setTimeout(() => {

      document.body.removeChild(container);

    }, 1000);
  }, time)
};

export default splash;
