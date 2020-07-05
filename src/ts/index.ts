import MathGen from "./MathGen";
import * as katex from "katex";

const $page = document.querySelector(".page");
const $math = document.querySelector(".math");
const $seedInput = document.querySelector(".seed__input") as HTMLInputElement;
const $seedSubmit = document.querySelector(".seed__submit") as HTMLInputElement;
const $seedRandom = document.querySelector(".seed__random") as HTMLInputElement;

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

// Generate random math problems
let $div: HTMLDivElement;
for (let i = 0; i < 20; i++) {
  let thisLine = MathGen.Prando.nextInt(0, 2);
  switch (thisLine) {
    case 0:
      $div = document.createElement("div");
      $div.classList.add("problem");
      katex.render(MathGen.mkAddition(), $div);
      $math?.insertAdjacentElement("beforeend", $div);
      break;
    case 1:
      $div = document.createElement("div");
      $div.classList.add("problem");
      katex.render(MathGen.mkSubtraction(), $div);
      $math?.insertAdjacentElement("beforeend", $div);
      break;
    case 2:
      $div = document.createElement("div");
      $div.classList.add("problem");
      katex.render(MathGen.mkMultiplication(), $div);
      $math?.insertAdjacentElement("beforeend", $div);
      break;
    case 3:
      $div = document.createElement("div");
      $div.classList.add("problem");
      katex.render(MathGen.mkMultiplication(), $div);
      $math?.insertAdjacentElement("beforeend", $div);
      break;
    default:
      break;
  }
}

/* for (let i = 0; i < 20; i++) {
  let $div = document.createElement("div");
  $div.classList.add("problem");
  katex.render(MathGen.mkMultiplication(), $div);
  $math?.insertAdjacentElement("beforeend", $div);
}
 */
