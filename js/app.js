import * as dom from "./dom.js";
import * as dice from "./dice.js";
import * as html from "./html.js";
import Stats from "./stats.js";

const stats = new Stats(Object.keys(STATISTIQUES));

// Load statistics
stats.load();

for (let key in STATISTIQUES) {
  dom.id('stats').appendChild(html.parse(
    '<div class="form-row mb-1">' +
    '<label for="stats-' + key + '" class="col-12 col-sm-3 col-lg-2 col-form-label">' + STATISTIQUES[key] + '</label>' +
    '<div class="col-auto">' +
    '<input type="number" class="form-control" id="stats-' + key + '" name="' + key + '" value="' + stats.get(key) + '" placeholder="10, 20, ...">' +
    '</div>' +
    '<div class="col-auto">' +
    '<button class="btn btn-outline-primary stat-launch mr-2" id="stat-launch-' + key + '">&nbsp;' + dice.dice_as_html(20, true) + '&nbsp;</button>&nbsp;' +
    '<span id="stat-result-' + key + '"></span>' +
    '</div>' +
    '</div>'
  ));

  dom.id('select-stat-1').appendChild(html.parse('<option value="' + key + '">' + STATISTIQUES[key] + '</option>'));
  dom.id('select-stat-2').appendChild(html.parse('<option value="' + key + '">' + STATISTIQUES[key] + '</option>'));
}

// Save stats on update
dom.add_delegate_event(dom.id('stats'), 'change', 'input', (event) => {
  const target = (/** @type {HTMLInputElement} */ event.target);

  stats.set(target.name, target.value);
});


// Calculate chance
dom.id('calc').addEventListener('mouseup', (event) => {
  const stat1 = parseInt(dom.id('stat-1').value, 10);
  const stat2 = parseInt(dom.id('stat-2').value, 10);

  const d20 = dice.roll(20);
  dom.id('chance-d20').textContent = '' + d20;

  const chance = stat1 + stat2 - 100 - d20;
  dom.id('chance-need').textContent = '' + chance;


  const d100 = dice.roll(100);
  dom.id('chance-d100').textContent = '' + d100;

  const {result, classes} = dice.render(100, d100, chance);

  const $result = dom.id('result');

  $result.textContent = result;
  $result.classList.remove(...$result.classList.values());
  $result.classList.add("p-2", "rounded", "border", ...classes)
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

// launch stats
for (let key in STATISTIQUES) {
  dom.id('stat-launch-' + key).addEventListener('click', (event) => {
    event.preventDefault();
    const d100 = dice.roll(100);
    const {result, classes} = dice.render(100, d100, stats.get(key));
    const $result = dom.id('stat-result-' + key);
    $result.textContent = d100 + ' : ' + result;
    $result.classList.remove(...$result.classList.values());
    $result.classList.add("p-2", "rounded", "border", ...classes)
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

  result.innerHTML = '';

  for (let n = 0; n < numbers_of_d; n++) {
    result.appendChild(html.parse(
      '<div class="flex-fill">' +
      dice.dice_as_html(faces_of_d) +
      '<span class="badge">' +
      dice.roll(faces_of_d) +
      '</span>' +
      '</div>'
    ));
  }
};

dom.add_delegate_event(dom.id('d-launcher'), 'change', 'select', d_compute);
dom.add_delegate_event(dom.id('d-launcher'), 'click', 'button', d_compute);
