import MathGen from "./MathGen";
import * as katex from "katex";

const $page = document.querySelector(".page");
const $math = document.querySelector(".math");
const $seedKey = document.querySelector(".seed__key") as HTMLInputElement;
const $seedGenerator = document.querySelector(".seed__generator") as HTMLInputElement;
const $seedSubmit = document.querySelector(".seed__submit") as HTMLInputElement;
const $seedRandom = document.querySelector(".seed__random") as HTMLInputElement;
const $menuAnswers = document.querySelector(".menu__answers") as HTMLInputElement;

$seedGenerator.value = MathGen.seed;
$seedKey.value = MathGen.key;

function setSeed() {
  let urlSearchParams = new URLSearchParams();

  urlSearchParams.set("key", $seedKey.value);
  urlSearchParams.set("seed", $seedGenerator.value);
  window.location.search = urlSearchParams.toString();
}

function setRandomSeed() {
  let urlSearchParams = new URLSearchParams();

  urlSearchParams.set("key", $seedKey.value);
  window.location.search = urlSearchParams.toString();
}

$seedGenerator?.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    setSeed();
  }
});
$seedSubmit?.addEventListener("click", setSeed);
$seedRandom?.addEventListener("click", setRandomSeed);

function getAnswers() {
  let urlSearchParams = new URLSearchParams();

  urlSearchParams.set("key", $seedKey.value);
  urlSearchParams.set("seed", $seedGenerator.value);
  urlSearchParams.set("answers", "");
  window.location.search = urlSearchParams.toString();
}
$menuAnswers?.addEventListener("click", getAnswers);

// Generate random math problems
function mkMathProblems() {
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
        katex.render("SKIP", $div);
        break;
    }
    $math?.insertAdjacentElement("beforeend", $div);
  }
}
// TODO make the builder/customizer dialog, run this function once they are ready to generate the problems
mkMathProblems();
