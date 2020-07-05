import MathGen from "./MathGen";
import * as katex from "katex";

const $page = document.querySelector(".page");
const $math = document.querySelector(".math");
const $seedInput = document.querySelector(".seed__input") as HTMLInputElement;
const $seedSubmit = document.querySelector(".seed__submit") as HTMLInputElement;
const $seedRandom = document.querySelector(".seed__random") as HTMLInputElement;
const $menuAnswers = document.querySelector(".menu__answers") as HTMLInputElement;

$seedInput.value = MathGen.seed;

function setSeed() {
  let urlSearchParams = new URLSearchParams();

  urlSearchParams.set("seed", $seedInput.value);
  window.location.search = urlSearchParams.toString();
}

function setRandomSeed() {
  window.location.search = "";
}

$seedInput?.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    setSeed();
  }
});
$seedSubmit?.addEventListener("click", setSeed);
$seedRandom?.addEventListener("click", setRandomSeed);

function getAnswers() {
  let urlSearchParams = new URLSearchParams();

  urlSearchParams.set("seed", $seedInput.value);
  urlSearchParams.append("answers", "");
  window.location.search = urlSearchParams.toString();
}
$menuAnswers?.addEventListener("click", getAnswers);

// Generate random math problems
let $div: HTMLDivElement;
for (let i = 0; i < 28; i++) {
  let thisLine = MathGen.Prando.nextInt(0, 4);
  $div = document.createElement("div");
  $div.classList.add("problem");
  if (MathGen.answersMode) {
    $div.classList.add("problem--answer");
  }

  switch (thisLine) {
    case 0:
      katex.render(MathGen.mkAddition(), $div);
      break;
    case 1:
      katex.render(MathGen.mkSubtraction(), $div);
      break;
    case 2:
      katex.render(MathGen.mkMultiplication(), $div);
      break;
    case 3:
      katex.render(MathGen.mkDivision(), $div);
      break;
    case 4:
      katex.render(MathGen.mkDivisionWithFraction(), $div);
      break;
    default:
      katex.render("???", $div);
      break;
  }
  $math?.insertAdjacentElement("beforeend", $div);
}
