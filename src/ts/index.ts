import MathGen from "./MathGen";
import * as katex from "katex";

const $page = document.querySelector(".page");
const $math = document.querySelector(".math");
const $seedInput = document.querySelector(".seed__input") as HTMLInputElement;
const $seedSubmit = document.querySelector(".seed__submit") as HTMLInputElement;

$seedInput.value = MathGen.seed;

function setSeed() {
  let urlSearchParams = new URLSearchParams();

  urlSearchParams.set("seed", $seedInput.value);
  window.location.search = urlSearchParams.toString();
}

$seedInput?.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    setSeed();
  }
})
$seedSubmit?.addEventListener("click", setSeed);

for (let i = 0; i < 20; i++) {
  let $div = document.createElement("div");
  $div.classList.add("problem");
  katex.render(MathGen.mkAddition(), $div);
  $math?.insertAdjacentElement("beforeend", $div);
}
