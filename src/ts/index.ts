import Prando from 'prando';
import MathGen from './MathGen';
import LZString from 'lz-string';

class App {
  private MathGen: MathGen;

  private readonly $math: HTMLDivElement = document.getElementById("math") as HTMLDivElement;
  private readonly $seedKey: HTMLInputElement = document.getElementById("seed-key") as HTMLInputElement;
  private readonly $seedGenerator: HTMLInputElement = document.getElementById("seed-generator") as HTMLInputElement;
  private readonly $parameters: HTMLInputElement = document.getElementById("parameters") as HTMLInputElement;
  private readonly $seedSubmit: HTMLInputElement = document.getElementById("seed-submit") as HTMLInputElement;
  private readonly $seedRandom: HTMLInputElement = document.getElementById("seed-random") as HTMLInputElement;
  private readonly $menuAnswers: HTMLInputElement = document.getElementById("answers") as HTMLInputElement;
  private readonly $menuNoAnswers: HTMLInputElement = document.getElementById("no-answers") as HTMLInputElement;
  private readonly $parametersSubmit: HTMLInputElement = document.getElementById("parameters-submit") as HTMLInputElement;
  private readonly $$configItem: HTMLInputElement[] = [...document.getElementsByClassName("config-item")] as HTMLInputElement[];

  private readonly DEFAULT_PARAMETERS: string = "AwkRjYE5knLraT7IWjrWJ5l/0sC9cg==";

  // TODO define an interface for configFlags
  private configs: Map<string, number> = new Map();
  private configFlags: any[] = [];
  private configFinal: string = "";
  private answersMode: boolean;

  constructor() {
    let urlSearchParams = new URLSearchParams(window.location.search);

    this.$seedKey.value = urlSearchParams.get("key") ?? new Prando().nextString(8);
    this.$seedGenerator.value = urlSearchParams.get("seed")?.substr(0, 16) ?? new Prando().nextString(16);
    this.$parameters.value = urlSearchParams.get("parameters") ?? this.DEFAULT_PARAMETERS;

    this.answersMode = urlSearchParams.has("answers") ?? false;

    this.MathGen = new MathGen(this.$seedKey.value, this.$seedGenerator.value);

    this.readConfig();
    this.mkMathProblems();
  }

  private readConfig() {
    let parameters = LZString.decompressFromBase64(this.$parameters.value);
    let numberParameters = parameters?.substr(6);
    let index = 0;

    // NOTE This is a bitwise number
    let checkBoxParameters = parseInt(parameters?.substr(0, 6) ?? "", 36);
    let checkboxNumber = 0;

    this.$$configItem.forEach((value: HTMLInputElement) => {
      switch(value.type) {
        case "checkbox":
          if (checkBoxParameters >> checkboxNumber & 1) {
            value.checked = true;
            this.configs.set(value.id, 1);
          } else {
            value.checked = false;
            this.configs.set(value.id, 0);
          }

          checkboxNumber++;
          break;
        case "number":
          let number = parseInt(numberParameters?.charAt(index) ?? "", 36);
          index++;

          // the character after determines the sign
          if (numberParameters?.charAt(index) === "1") {
            number *= -1;
          }
          index++;

          value.value = number.toString();
          this.configs.set(value.id, number);
          break;
      }
    });

    this.$seedGenerator.addEventListener("keypress", (event) => { if (event.key === "Enter") this.setSeed(); });
    this.$seedSubmit.addEventListener("click", () => this.setSeed());
    this.$seedRandom.addEventListener("click", () => this.setRandomSeed());
    this.$menuAnswers.addEventListener("click", () => this.getAnswers(true));
    this.$menuNoAnswers.addEventListener("click", () => this.getAnswers(false));
    this.$$configItem.forEach((value: HTMLInputElement) => value.addEventListener("click", () => this.configItem_change()));
    this.$parametersSubmit.addEventListener("click", () => this.setParameters());

    this.configItem_change();
  }

  private setSeed() {
    let urlSearchParams = new URLSearchParams(window.location.search);

    urlSearchParams.set("key", this.$seedKey.value);
    urlSearchParams.set("seed", this.$seedGenerator.value);
    urlSearchParams.set("parameters", this.$parameters.value);
    window.location.search = urlSearchParams.toString();
  }

  private setRandomSeed() {
    let urlSearchParams = new URLSearchParams(window.location.search);

    urlSearchParams.delete("seed");
    urlSearchParams.set("key", this.$seedKey.value);
    urlSearchParams.set("parameters", this.$parameters.value);
    window.location.search = urlSearchParams.toString();
  }

  private getAnswers(answers: boolean) {
    let urlSearchParams = new URLSearchParams(window.location.search);

    urlSearchParams.set("key", this.$seedKey.value);
    urlSearchParams.set("seed", this.$seedGenerator.value);
    urlSearchParams.set("parameters", this.$parameters.value);

    if (answers) {
      urlSearchParams.set("answers", "");
    } else {
      urlSearchParams.delete("answers");
    }
    window.location.search = urlSearchParams.toString();
  }

  private configItem_change() {
    this.configFlags = [];

    // This is a bitwise number
    let checkBoxes = 0;
    let checkboxNumber = 0;

    this.$$configItem.forEach((value: HTMLInputElement) => {
      switch(value.type) {
        case "checkbox":
          if (value.checked) {
            checkBoxes |= 1 << checkboxNumber;
          }
          checkboxNumber++
          break;
        case "number":
          if (isNaN(parseInt(value.value))) {
            value.value = "0";
          }
          // FIXME not everything has a max value of 35 -- should check the max value from the tag
          if (parseInt(value.value) > 35) {
            value.value = "35";
          }
      
          let number = parseInt(value.value, 10);
          if (value.id === "conf-min-number") {
            this.MathGen.minNumber = number;
          } else if (value.id === "conf-max-number") {
            this.MathGen.maxNumber = number;
          }

          let isNumberNegative = "0";
          if (number < 0) {
            isNumberNegative = "1";
            number = Math.abs(number);
          }
          this.configFlags.push(number.toString(36).substr(-1), isNumberNegative);
          break;
      }
    });

    this.configFinal = LZString.compressToBase64(checkBoxes.toString(36).padStart(6, "0") + this.configFlags.join(""));
    this.$parameters.value = this.configFinal;
  }

  private setParameters() {
    this.configItem_change();
    let urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.set("parameters", this.configFinal);
    window.location.search = urlSearchParams.toString();
  }

  private mkMathProblems() {
    let mkConfig: number[] = [];
  
    if (this.configs.get("conf-addi-basic"))
      mkConfig.push(0);
    if (this.configs.get("conf-addi-deci"))
      mkConfig.push(1);
    if (this.configs.get("conf-addi-frac"))
      mkConfig.push(2);

    if (this.configs.get("conf-subt-basic"))
      mkConfig.push(3);
    if (this.configs.get("conf-subt-deci"))
      mkConfig.push(4);
    if (this.configs.get("conf-subt-frac"))
      mkConfig.push(5);

    if (this.configs.get("conf-mult-basic"))
      mkConfig.push(6);
    if (this.configs.get("conf-mult-deci"))
      mkConfig.push(7);
    if (this.configs.get("conf-mult-frac"))
      mkConfig.push(8);

    if (this.configs.get("conf-divi-basic"))
      mkConfig.push(9);
    if (this.configs.get("conf-divi-deci"))
      mkConfig.push(10);
    if (this.configs.get("conf-divi-frac"))
      mkConfig.push(11);

    if (this.configs.get("conf-long-basic"))
      mkConfig.push(12);
    if (this.configs.get("conf-long-deci"))
      mkConfig.push(13);
  
    let $div: HTMLDivElement;
    for (let i = 0; i < 24; i++) {
      let thisLine = this.MathGen.Prando.nextArrayItem(mkConfig);
      $div = document.createElement("div");
      $div.classList.add("problem");
      if (this.answersMode) {
        $div.classList.add("problem--answer");
      }

      let problem: string;
      switch (thisLine) {
        case 0:
          problem = this.MathGen.mkAdditionBasics(this.configs.get("conf-addi-basic-min") as number, this.configs.get("conf-addi-basic-max") as number, !!this.configs.get("conf-addi-basic-vert"), this.answersMode);
          break;
        case 1:
          problem = this.MathGen.mkAdditionDecimals(this.configs.get("conf-addi-deci-min") as number, this.configs.get("conf-addi-deci-max") as number, !!this.configs.get("conf-addi-deci-vert"), this.configs.get("conf-addi-deci-placevals") as number, this.answersMode);
          break;
        case 2:
          problem = this.MathGen.mkAdditionFractions(this.configs.get("conf-addi-frac-numer-min") as number, this.configs.get("conf-addi-frac-numer-max") as number, this.configs.get("conf-addi-frac-denom-min") as number, this.configs.get("conf-addi-frac-denom-max") as number, !!this.configs.get("conf-addi-frac-denom-same"), this.answersMode);
          break;
        case 3:
          problem = this.MathGen.mkSubtractionBasics(this.configs.get("conf-addi-basic-min") as number, this.configs.get("conf-addi-basic-max") as number, !!this.configs.get("conf-subt-basic-negatives"), !!this.configs.get("conf-addi-basic-vert"), this.answersMode);
          break;
        case 4:
          problem = this.MathGen.mkSubtractionDecimals(this.configs.get("conf-subt-deci-min") as number, this.configs.get("conf-subt-deci-max") as number, !!this.configs.get("conf-subt-deci-negatives"), !!this.configs.get("conf-subt-deci-vert"), this.configs.get("conf-subt-deci-placevals") as number, this.answersMode);
          break;
        case 5:
          problem = this.MathGen.mkSubtractionFractions(this.configs.get("conf-subt-frac-numer-min") as number, this.configs.get("conf-subt-frac-numer-max") as number, this.configs.get("conf-subt-frac-denom-min") as number, this.configs.get("conf-subt-frac-denom-max") as number, !!this.configs.get("conf-subt-frac-negatives"), !!this.configs.get("conf-subt-frac-denom-same"), this.answersMode);
          break;
        case 6:
          problem = this.MathGen.mkMultiplicationBasics(this.configs.get("conf-mult-basic-min") as number, this.configs.get("conf-mult-basic-max") as number, !!this.configs.get("conf-mult-basic-vert"), this.answersMode);
          break;
        case 7:
          problem = this.MathGen.mkMultiplicationDecimals(this.configs.get("conf-mult-deci-min") as number, this.configs.get("conf-mult-deci-max") as number, !!this.configs.get("conf-mult-deci-vert"), this.configs.get("conf-mult-deci-placevals") as number, this.answersMode);
          break;
        case 8:
          problem = this.MathGen.mkMultiplicationFractions(this.configs.get("conf-mult-frac-numer-min") as number, this.configs.get("conf-mult-frac-numer-max") as number, this.configs.get("conf-mult-frac-denom-min") as number, this.configs.get("conf-mult-frac-denom-max") as number, this.answersMode);
          break;
        case 9:
          problem = this.MathGen.mkDivisionBasic(this.configs.get("conf-divi-basic-divisor-min") as number, this.configs.get("conf-divi-basic-divisor-max") as number, this.configs.get("conf-divi-basic-quotient-min") as number, this.configs.get("conf-divi-basic-quotient-max") as number, !!this.configs.get("conf-subt-basic-remainders"), this.answersMode);
          break;
        case 10:
          problem = this.MathGen.mkDivisionDecimals(this.configs.get("conf-divi-deci-divisor-min") as number, this.configs.get("conf-divi-deci-divisor-max") as number, this.configs.get("conf-divi-deci-quotient-min") as number, this.configs.get("conf-divi-deci-quotient-max") as number, !!this.configs.get("conf-subt-deci-decimal-divisor"), this.configs.get("conf-divi-deci-placevals") as number, this.answersMode);
          break;
        case 11:
          problem = this.MathGen.mkDivisionFractions(this.configs.get("conf-divi-frac-numer-min") as number, this.configs.get("conf-divi-frac-numer-max") as number, this.configs.get("conf-divi-frac-denom-min") as number, this.configs.get("conf-divi-frac-denom-max") as number, this.answersMode);
          break;
        case 12:
          problem = this.MathGen.mkLongBasics(this.configs.get("conf-long-basic-divisor-min") as number, this.configs.get("conf-long-basic-divisor-max") as number, this.configs.get("conf-long-basic-quotient-min") as number, this.configs.get("conf-long-basic-quotient-max") as number, !!this.configs.get("conf-long-basic-remainders"), this.answersMode);
          break;
        case 13:
          problem = this.MathGen.mkLongDecimals(this.configs.get("conf-long-deci-divisor-min") as number, this.configs.get("conf-long-deci-divisor-max") as number, this.configs.get("conf-long-deci-quotient-min") as number, this.configs.get("conf-long-deci-quotient-max") as number, !!this.configs.get("conf-long-deci-decimal-divisor"), this.configs.get("conf-long-deci-placevals") as number, this.answersMode);
          break;
        default:
          problem = 'SKIP';
          break;
      }
      this.MathGen.render(problem, $div);
      this.$math.insertAdjacentElement("beforeend", $div);
    }
  }
}
new App();
