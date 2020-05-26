import {parse, stringify} from "./html.js";
import {icon as svg} from "./icons.js";
import {content, elem} from "./dom.js";

export const DICE_ROLLING = 600; // ms

const dice_number = (number) => {
  if (number > 20) {
    return 20
  } else if (number > 10) {
    return 12
  } else if (number > 8) {
    return 10
  } else if (number > 6) {
    return 8
  } else if (number > 4) {
    return 6
  }

  return 4
};

export const roll = (number) => Math.floor(Math.random() * Math.floor(number)) + 1;

export const dice = (number, size = '2x') => {
  return svg('dice-' + dice_number(number), size);
};

export const dice_as_html = (number, size = '2x') => {
  return dice(number, size).then(stringify)
};

export const dice_roll = (number, size, rolling) => {
  return dice(number, 'stack-2x').then((icon) => {

    const d = elem('span', {
      classes: 'fa-stack',
      body: icon
    });

    if (size) {
      d.classList.add('fa-' + size)
    }

    if (rolling) {
      d.classList.add('rolling')
    }

    const dice_roll = roll(number);

    const res = elem('span', {
      classes: 'fa-stack-1x',
      body: elem('span', {
        classes: 'rounded-lg bg-light small font-weight-bold',
        attrs: {style: 'padding: 0.05em 0.2em'},
        body: dice_roll
      })
    });

    let promise;
    if (rolling) {
      promise = new Promise((r) => {
        setTimeout(() => {
          d.classList.remove('rolling');
          content(d, res);

          r(dice_roll)
        }, DICE_ROLLING)
      })
    } else {
      promise = Promise.resolve(dice_roll);
      content(d, res);
    }

    return {d, promise}
  })
};
export const render = (dice, roll, stats, critical = 3) => {
  let crit = false;
  const critical_success = critical;
  const critical_failure = dice - critical;

  let result, color, icon;

  if (roll <= critical_success) {
    crit = true;
    result = "Reussite";
    color = "success";
    icon = "hand-holding-magic"
  } else if (roll > critical_failure) {
    crit = true;
    result = "Echec";
    color = "danger";
    icon = "poo"
  } else if (roll <= stats) {
    result = "Reussite";
    color = "success";
  } else {
    result = "Echec";
    color = "danger";
  }

  if (crit) {
    return svg(icon, 'lg').then((icon) => elem('span', {
      classes: "btn text-white border-" + color + " bg-" + color,
      body: [
        elem('span', {classes: 'badge badge-light', body: roll}),
        ' ',
        result + " Critique",
        ' ',
        icon,
      ]
    }));
  }

  return Promise.resolve(elem('span', {
    classes: "btn text-" + color + " border-" + color,
    body: [
      elem('span', {classes: 'mr-1 badge badge-' + color, body: roll}),
      result,
    ]
  }));
};
