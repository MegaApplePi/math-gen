import { config } from "process";
import MathGen from "./MathGen";

const $math = document.getElementById("math") as HTMLDivElement;
const $seedKey = document.getElementById("seed-key") as HTMLInputElement;
const $seedGenerator = document.getElementById("seed-generator") as HTMLInputElement;
const $parameters = document.getElementById("parameters") as HTMLInputElement;

const $seedSubmit = document.getElementById("seed-submit") as HTMLInputElement;
const $seedRandom = document.getElementById("seed-random") as HTMLInputElement;
const $menuAnswers = document.getElementById("answers") as HTMLInputElement;
const $parametersSubmit = document.getElementById("parameters-submit") as HTMLInputElement;

/* configFlags order
00 - Addition <bool>
01 - " but vertical <bool>
02 - Subtraction <bool>
03 - " but vertical <bool>
04 - " but with negative differences <bool>
05 - Multiplication <bool>
06 - " but vertical <bool>
07 - Division <bool>
08 - " but long division <bool>
09 - Division with fractional answers <bool>
00 - " but long division <bool>
11 - min number <base36 number>
12 - negative bit for 08/09 <bool>
13 - max number <base36 number>
14 - negative bit for 11/12 <bool>

* <base36 number> = value between 0 and Z. With only 1 place value, the max value is 35
 */
// TODO define an interface for configFlags
let configFlags: any[] = [];
const $$configItem = [...document.getElementsByClassName("config-item")] as HTMLInputElement[];

$seedGenerator.value = MathGen.seed;
$seedKey.value = MathGen.key;
$parameters.value = MathGen.parameters;
function setConfig() {
  let parameters = $parameters.value;
  let index = 0;

  $$configItem.forEach((value: HTMLInputElement) => {
    switch(value.type) {
      case "checkbox":
        value.checked = parameters[index++] === "1" ? true : false;
        break;
      case "number":
        let number = parseInt(parameters[index++], 36);

        if (parameters[index++] === "1") {
          number *= -1;
        }
        value.value = number.toString();
        break;
    }
  });
  configItem_change()
  mkMathProblems();
}
setConfig();


function setSeed() {
  let urlSearchParams = new URLSearchParams(window.location.search);

  urlSearchParams.set("key", $seedKey.value);
  urlSearchParams.set("seed", $seedGenerator.value);
  window.location.search = urlSearchParams.toString();
}

$seedGenerator.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    setSeed();
  }
});
$seedSubmit.addEventListener("click", setSeed);


function setRandomSeed() {
  let urlSearchParams = new URLSearchParams(window.location.search);

  urlSearchParams.set("key", $seedKey.value);
  window.location.search = urlSearchParams.toString();
}
$seedRandom.addEventListener("click", setRandomSeed);


function getAnswers() {
  let urlSearchParams = new URLSearchParams(window.location.search);

  urlSearchParams.set("key", $seedKey.value);
  urlSearchParams.set("seed", $seedGenerator.value);
  urlSearchParams.set("answers", "");
  window.location.search = urlSearchParams.toString();
}
$menuAnswers.addEventListener("click", getAnswers);


function updateConfig() {
  $parameters.value = configFlags.join("");
}

function configItem_change() {
  configFlags = [];
  $$configItem.forEach((value: HTMLInputElement) => {
    switch(value.type) {
      case "checkbox":
        configFlags.push(value.checked ? 1 : 0);
        break;
      case "number":
        if (isNaN(parseInt(value.value))) {
          value.value = "0";
        }
        if (parseInt(value.value) > 35) {
          value.value = "35";
        }
    
        let number = parseInt(value.value, 10);
        if (value.id === "conf-min-number") {
          MathGen.minNumber = number;
        } else if (value.id === "conf-max-number") {
          MathGen.maxNumber = number;
        }

        let isNumberNegative = "0";
        if (number < 0) {
          isNumberNegative = "1";
          number = Math.abs(number);
        }
        configFlags.push(number.toString(36).substr(-1), isNumberNegative);

        break;
    }
  });

  updateConfig();
}
$$configItem.forEach((value: HTMLInputElement) => {
  value.addEventListener("click", configItem_change);
});

function setParameters() {
  configItem_change();
  let urlSearchParams = new URLSearchParams(window.location.search);
  urlSearchParams.set("parameters", configFlags.join(""));
  window.location.search = urlSearchParams.toString();
}
$parametersSubmit.addEventListener("click", setParameters);


// Generate random math problems
function mkMathProblems() {
  let mkConfig: number[] = [];

  if (configFlags[0])
    mkConfig.push(0);
  if (configFlags[2])
    mkConfig.push(1);
  if (configFlags[5])
    mkConfig.push(2);
  if (configFlags[7])
    mkConfig.push(3);
  if (configFlags[9])
    mkConfig.push(4);

  let $div: HTMLDivElement;
  for (let i = 0; i < 24; i++) {
    let thisLine = MathGen.Prando.nextArrayItem(mkConfig);
    $div = document.createElement("div");
    $div.classList.add("problem");
    if (MathGen.answersMode) {
      $div.classList.add("problem--answer");
    }

    switch (thisLine) {
      case 0:
        if (configFlags[1]) {
          MathGen.render(MathGen.mkAdditionVertical(), $div);
        } else {
          MathGen.render(MathGen.mkAddition(), $div);
        }
        break;
      case 1:
        if (configFlags[3]) {
          MathGen.render(MathGen.mkSubtractionVertical(), $div);
        } else {
          MathGen.render(MathGen.mkSubtraction(), $div);
        }
        break;
      case 2:
        if (configFlags[6]) {
          MathGen.render(MathGen.mkMultiplicationVertical(), $div);
        } else {
          MathGen.render(MathGen.mkMultiplication(), $div);
        }
        break;
      case 3:
        if (configFlags[8]) {
          MathGen.render(MathGen.mkDivisionLong(), $div);
        } else {
          MathGen.render(MathGen.mkDivision(), $div);
        }
        break;
      case 4:
        if (configFlags[10]) {
          MathGen.render(MathGen.mkDivisionWithFractionLong(), $div);
        } else {
          MathGen.render(MathGen.mkDivisionWithFraction(), $div);
        }
        break;
      default:
        MathGen.render("SKIP", $div);
        break;
    }
    $math.insertAdjacentElement("beforeend", $div);
  }
}
