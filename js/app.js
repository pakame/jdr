import * as dom from "./dom.js";
import * as dice from "./dice.js";
import * as icon from "./icons.js"
import * as loader from "./loader.js"
import render from "./render.js"
import Stats from "./stats.js";
import ready from "./ready.js";

const DICE_ROLLING = 600; // ms

const load_player = (player) => {

  const STATISTIQUES = player.statistics;
  const stats = new Stats(Object.keys(STATISTIQUES));

// Load statistics
  stats.load();

// auto load icon
  icon.auto();

// Generate contents
  for (let key in STATISTIQUES) {
    const stats_label = STATISTIQUES[key];
    dice.dice(100, 'lg').then((icon) => {
      dom.id('stats').appendChild(
        dom.elem('div', {
          classes: ['form-row', 'mb-1'],
          body: [
            dom.elem('label', {
              classes: 'col-12 col-sm-3 col-lg-2 col-xl-3 col-form-label',
              attrs: {for: 'stats-' + key},
              body: stats_label
            }),
            dom.elem('div', {
              classes: 'col-auto',
              body: dom.elem('input', {
                classes: 'form-control',
                attrs: {
                  id: 'stats-' + key, type: 'number', name: key, value: stats.get(key),
                  placeholder: 'Enter your stats for ' + stats_label
                }
              })
            }),
            dom.elem('div', {
              classes: 'col-auto',
              body: dom.elem('button', {
                classes: 'btn btn-primary stat-launch mr-2 rolling-on-click',
                attrs: {type: 'button', name: key},
                body: ['- ', icon, ' -']
              })
            }),
            dom.elem('div', {
              classes: 'col-auto',
              body: dom.elem('span', {classes: 'result'})
            })
          ]
        })
      );
    });

    const option = dom.elem('option', {attrs: {value: key}, body: stats_label});

    dom.id('select-stat-1').appendChild(option);
    dom.id('select-stat-2').appendChild(option.cloneNode(true));
  }

  // Save stats on update
  dom.add_delegate_event(dom.id('stats'), 'change', 'input', (event) => {
    const target = (/** @type {HTMLInputElement} */ event.target);

    stats.set(target.name, target.value);
  });

  // launch stats
  dom.add_delegate_event(dom.id('stats'), 'click', 'button', (event, target) => {
    event.preventDefault();

    target.disabled = true;
    target.classList.add("rolling");

    const $result = target.parentElement.nextElementSibling;

    dom.empty($result);

    setTimeout(() => {
      target.classList.remove("rolling");
      target.disabled = false;

      const d100 = dice.roll(100);
      const $result = target.parentElement.nextElementSibling;

      dom.content(
        $result,
        dice.render(100, d100, stats.get(target.name))
      );
    }, DICE_ROLLING)
  });

  // Calculate chance
  dom.add_event(dom.id('calc'), 'mouseup', (event) => {
    const stat1 = parseInt(dom.id('stat-1').value, 10);
    const stat2 = parseInt(dom.id('stat-2').value, 10);

    const d20 = dice.roll(20);
    dom.id('chance-d20').textContent = '' + d20;

    const chance = stat1 + stat2 - 100 - d20;
    dom.id('chance-need').textContent = '' + chance;

    const d100 = dice.roll(100);
    dom.id('chance-d100').textContent = '' + d100;

    const $result = dom.id('result');
    dom.empty($result);
    dom.content(
      $result,
      dice.render(100, d100, chance)
    )
  });

  // Register change on stats for chance
  for (let i = 1; i < 3; i++) {
    const select_id = 'select-stat-' + i;
    const input_id = 'stat-' + i;

    dom.id(select_id).addEventListener('change', (event) => {
      const select = (/** @type {HTMLSelectElement}*/dom.id(select_id));

      dom.id(input_id).value = stats.get(select.value)
    })
  }

  // Dés
  const d_compute = (event) => {
    event.preventDefault();

    const numbers_of_d = parseInt(dom.id('d-numbers').value, 10);
    const faces_of_d = parseInt(dom.id('d-faces').value, 10);

    if (!numbers_of_d || !faces_of_d) {
      return;
    }

    const result = dom.id('d-result');

    dom.empty(result);

    for (let n = 0; n < numbers_of_d; n++) {
      dice.dice(faces_of_d).then((icon) => {
        icon.firstElementChild.classList.add('fa-stack-2x');

        const res = dom.elem('span', {
          classes: 'fa-stack-1x',
        });
        const d = dom.elem('span', {
          classes: 'fa-stack fa-2x rolling',
          body: [icon, res]
        });

        result.appendChild(dom.elem('div', {
          classes: 'col-4 mb-3',
          body: d
        }));

        setTimeout(() => {
          d.classList.remove('rolling');
          dom.content(res, dom.elem('span', {
            classes: 'rounded-lg bg-light small font-weight-bold',
            attrs: {style: 'padding: 0.05em 0.2em'},
            body: dice.roll(faces_of_d)
          }))
        }, DICE_ROLLING)
      })
    }
  };

  dom.add_delegate_event(dom.id('d-launcher'), 'change', 'select', d_compute);
  dom.add_delegate_event(dom.id('d-launcher'), 'click', 'button', d_compute);
};

const load_tabs = (tabs) => {
  const nav = dom.id('section-link');
  const container = dom.id('section-container');

  for (let id in tabs) {
    const tab = tabs[id];

    nav.appendChild(dom.elem('a', {
      classes: 'nav-item nav-link',
      attrs: {href: '#' + id, 'data-toggle': 'tab'},
      body: tab.name
    }));

    container.appendChild(dom.elem('div', {
      classes: 'tab-pane',
      attrs: {id: id},
      body: render(tab.content)
    }))
  }
};

dom.add_delegate_event(document.body, 'click', '[data-toggle=tab]', (event, target) => {
  const target_id = target.getAttribute('href').substr(1);
  const element = dom.id(target_id);

  element.closest('.tab-content').querySelector('.tab-pane.active').classList.remove('active');
  element.classList.add('active');

  target.closest('.nav-tabs').querySelector('.nav-link.active').classList.remove('active');
  target.classList.add('active');
});

fetch('game.json')
  .then((game) => game.json())
  .then((game) => {

    load_player(game.player);
    load_tabs(game.tabs);

    ready(loader.hide);
  });
