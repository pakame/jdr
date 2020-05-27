import * as dom from "./dom.js";
import * as dice from "./dice.js";
import * as icon from "./icons.js"
import * as loader from "./loader.js"
import render from "./render.js"
import ready from "./ready.js";
import Player from "./player.js";

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
};

const DICE_ROLLING = dice.DICE_ROLLING;

const load_player = (data) => {
  const STATISTIQUES = data.statistics;
  const player = new Player({
    status: data.status,
    statistics: Object.keys(data.statistics)
  });

  // Load statistics
  player.load();

  // Generate contents
  for (let key in STATISTIQUES) {
    if (!STATISTIQUES.hasOwnProperty(key)) {
      continue;
    }

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
                  id: 'stats-' + key, type: 'number', name: key, value: player.getStat(key),
                  size: 2, maxlength: 2,
                  placeholder: 'Enter your stats for ' + stats_label
                }
              })
            }),
            dom.elem('div', {
              classes: 'col-auto',
              body: dom.elem('select', {
                classes: 'form-control custom-select',
                attrs: {id: 'bonus-malus-' + key, name: key + "-bonus-malus"},
                body: [
                  dom.elem('option', {attrs: {value: -30}, body: '-30'}),
                  dom.elem('option', {attrs: {value: -20}, body: '-20'}),
                  dom.elem('option', {attrs: {value: -15}, body: '-15'}),
                  dom.elem('option', {attrs: {value: -10}, body: '-10'}),
                  dom.elem('option', {attrs: {value: -5}, body: '-5'}),
                  dom.elem('option', {attrs: {value: 0, selected: true}, body: '±0'}),
                  dom.elem('option', {attrs: {value: 5}, body: '+5'}),
                  dom.elem('option', {attrs: {value: 10}, body: '+10'}),
                  dom.elem('option', {attrs: {value: 15}, body: '+15'}),
                  dom.elem('option', {attrs: {value: 20}, body: '+20'}),
                  dom.elem('option', {attrs: {value: 30}, body: '+30'}),
                ]
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
  dom.add_delegate_event(dom.id('stats'), 'change', 'input', (event, target) => {
    player.setStat(target.name, target.value);
  });

  // init life & destiny
  const init_counter = (name) => {
    const container = dom.id(name);

    const update = () => {
      dom.query('[name=value]', container).value = player['get' + name.capitalize()]();
    };

    dom.add_event(dom.query('[name=dec]', container), 'click', () => {
      player['dec' + name.capitalize()]();
      update()
    });
    dom.add_event(dom.query('[name=inc]', container), 'click', () => {
      player['inc' + name.capitalize()]();
      update()
    });

    update();
  };
  init_counter('life');
  init_counter('destiny');

  // design for bonus malus
  dom.add_delegate_event(dom.id('stats'), 'change', 'select', (event, target) => {
    const value = parseInt(target.value);

    target.classList.remove('border-success', 'border-danger');

    if (value > 0) {
      target.classList.add('border-success');
    } else if (value < 0) {
      target.classList.add('border-danger')
    }
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
      const $bonus = dom.id('bonus-malus-' + target.name);

      const stat = player.getStat(target.name) + parseInt($bonus.value);

      dice.render(100, d100, stat).then((content) => {
        dom.content($result, content);
        $bonus.value = 0;
        $bonus.dispatchEvent(new Event('change', {bubbles: true}))
      })
    }, DICE_ROLLING)
  });

  // Calculate chance
  dom.add_event(dom.id('calc'), 'mouseup', (event) => {
    dom.id('calc').disabled = true;
    const stat1 = parseInt(dom.id('stat-1').value, 10);
    const stat2 = parseInt(dom.id('stat-2').value, 10);
    const chance_formula = dom.id('chance-formula');
    const $result = dom.id('chance-result');
    dom.empty($result);

    dice.dice_roll(20, null, true)
      .then(({d, promise}) => {
        dom.empty(chance_formula);
        dom.content(chance_formula, "( " + stat1 + " + " + stat2 + " ) - 100 - ");
        dom.content(chance_formula, d);

        return promise
      })
      .then((d20) => {
        const chance = stat1 + stat2 - 100 - d20;

        dom.content(chance_formula, [" = ", dom.elem('span', {classes: 'badge badge-primary', body: chance})]);

        return chance;
      })
      .then((chance) => {
        return dice.dice_roll(100, null, true)
          .then(({d, promise}) => {
            const chance_d100 = dom.id('chance-d100');
            dom.empty(chance_d100);
            dom.content(chance_d100, d);

            return promise;
          })
          .then((d100) => dice.render(100, d100, chance))
          .then((content) => dom.content($result, content))
      })
      .then(() => {
        dom.id('calc').disabled = false;
      })
  });

  // Register change on stats for chance
  for (let i = 1; i < 3; i++) {
    const select_id = 'select-stat-' + i;
    const input_id = 'stat-' + i;

    dom.add_event(dom.id(select_id), 'change', (event) => {
      const select = (/** @type {HTMLSelectElement}*/dom.id(select_id));

      dom.id(input_id).value = player.getStat(select.value)
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
      dice.dice_roll(faces_of_d, "2x", true).then(({d}) => {
        result.appendChild(dom.elem('div', {
          classes: 'col-4 mb-3',
          body: d
        }));
      });
    }
  };

  dom.add_delegate_event(dom.id('d-launcher'), 'change', 'select', d_compute);
  dom.add_delegate_event(dom.id('d-launcher'), 'click', 'button', d_compute);
};

const load_tabs = (tabs) => {
  const nav = dom.id('section-link');
  const container = dom.id('section-container');
  const promises = [];

  for (let id in tabs) {
    if (!tabs.hasOwnProperty(id)) {
      continue;
    }

    const tab = tabs[id];

    promises.push(render(tab.name).then((frag) => {
      nav.appendChild(dom.elem('a', {
        classes: 'nav-item nav-link',
        attrs: {href: '#' + id, 'data-toggle': 'tab'},
        body: frag
      }))
    }));

    promises.push(render(tab.content).then((frag) => {
      container.appendChild(dom.elem('div', {
        classes: 'tab-pane',
        attrs: {id: id},
        body: frag
      }))
    }))
  }

  return Promise.all(promises);
};

dom.add_delegate_event(document.body, 'click', '[data-toggle=tab]', (event, target) => {
  const target_id = target.getAttribute('href').substr(1);
  const element = dom.id(target_id);

  element.closest('.tab-content').querySelector('.tab-pane.active').classList.remove('active');
  element.classList.add('active');

  target.closest('.nav-tabs').querySelector('.nav-link.active').classList.remove('active');
  target.classList.add('active');
});

ready(() => {
  fetch('game.json')
    .then((game) => game.json())
    .then((game) => {

      Promise.all([
        // auto load icon
        icon.auto(),
        // init player
        load_player(game.player),
        // init tabs
        load_tabs(game.tabs)
      ]).then(() => {
        setTimeout(loader.hide, 300)
      });
    });
});
