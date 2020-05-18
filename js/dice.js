import {parse, stringify} from "./html.js";
import {svg} from "./icons.js";

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
  return svg('dice-' + dice_number(number)).then((content) => {
    const icon = parse(content);

    icon.children[0].classList.add('fa-' + size);

    return icon;
  });
};

export const dice_as_html = (number, size = '2x') => {
  return dice(number, size).then(stringify)
};

export const render = (dice, roll, stats, critical = 3) => {
  let crit = false;
  const critical_success = critical;
  const critical_failure = dice - critical;

  let result, color;

  if (roll <= critical_success) {
    crit = true;
    result = "Reussite";
    color = "success";
  } else if (roll > critical_failure) {
    crit = true;
    result = "Echec";
    color = "danger";
  } else if (roll <= stats) {
    result = "Reussite";
    color = "success";
  } else {
    result = "Echec";
    color = "danger";
  }

  if (crit) {
    return parse(
      "<span class='d-inline-block col-form-label px-2 rounded border border-" + color + " bg-" + color + " text-white'>" +
      "<span class='badge badge-light'>" + roll + "</span>" +
      " " + result + " Critique" +
      "</span>"
    );
  }

  return parse(
    "<span class='d-inline-block col-form-label px-2 rounded border border-" + color + "'>" +
    "<span class='badge badge-" + color + "'>" + roll + "</span>" +
    " " + result +
    "</span>"
  );
};
