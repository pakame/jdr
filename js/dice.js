import {content} from "./template.js";
import {stringify} from "./html.js";

export const roll = (number) => Math.floor(Math.random() * Math.floor(number)) + 1;

export const dice = (number, small = false) => {
  if (number > 12) {
    number = 20
  } else if (number > 10) {
    number = 12
  } else if (number > 8) {
    number = 10
  } else if (number > 6) {
    number = 8
  } else if (number > 4) {
    number = 6
  } else {
    number = 4
  }

  const svg = content('dice-' + number);

  if (!small) {
    svg.children[0].classList.add('fa-2x')
  }

  return svg;
};

export const dice_as_html = (number, small = false) => {
  return stringify(dice(number, small))
};

export const render = (dice, roll, stats, critical = 3) => {
  const critical_success = critical;
  const critical_failure = dice - critical;

  let result, classes;

  if (roll <= critical_success) {
    result = "Reussite Critique";
    classes = ["border-success", 'bg-success', 'text-white'];
  } else if (roll > critical_failure) {
    result = "Echec Critique";
    classes = ["border-danger", 'bg-danger', 'text-white'];
  } else if (roll <= stats) {
    result = 'Reussite';
    classes = ["border-success"];
  } else {
    result = 'Echec';
    classes = ["border-danger"];
  }

  return {result, classes}
};
