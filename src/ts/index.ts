import Prando from 'prando';
import MathGen from './MathGen';

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

  private readonly DEFAULT_PARAMETERS: string = "0000z00000z020110z010z0000000z000000z0200010z010z000010z00010z020010z050z00010z040b00010z010z020010z010z00010z010z00010z010z020";
  private readonly PARAMTERS_REGEX_TEST: RegExp = /[0,1][0,1][0,1][0,1][0,1][0,1][0,1][0,1][0,1][0,1][0,1][0-z][0,1][0-z][0,1]/;

  // TODO define an interface for configFlags
  private configs: Map<string, number> = new Map();
  private configFlags: any[] = [];
  private answersMode: boolean;

  constructor() {
    let urlSearchParams = new URLSearchParams(window.location.search);

    this.$seedKey.value = urlSearchParams.get("key") ?? new Prando().nextString(8);
    this.$seedGenerator.value = urlSearchParams.get("seed")?.substr(0, 16) ?? new Prando().nextString(16);
    this.$parameters.value = urlSearchParams.get("parameters") ?? this.DEFAULT_PARAMETERS;

    this.answersMode = urlSearchParams.has("answers") ?? false;

    // if(!this.PARAMTERS_REGEX_TEST.test(this.$parameters.value)) {
    //   this.$parameters.value = this.DEFAULT_PARAMETERS;
    // }

    this.MathGen = new MathGen(this.$seedKey.value, this.$seedGenerator.value);

    this.readConfig();
    this.mkMathProblems();
  }

  private readConfig() {
    let parameters = this.$parameters.value;
    let index = 0;

    this.$$configItem.forEach((value: HTMLInputElement) => {
      switch(value.type) {
        case "checkbox":
          value.checked = parameters[index] === "1" ? true : false;
          this.configs.set(value.id, parameters[index] === "1" ? 1 : 0);
          index++;
          break;
        case "number":
          let number = parseInt(parameters[index], 36);
          index++;

          if (parameters[index] === "1") {
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

  private updateConfig() {
    this.$parameters.value = this.configFlags.join("");
  }

  private configItem_change() {
    this.configFlags = [];

    this.$$configItem.forEach((value: HTMLInputElement) => {
      switch(value.type) {
        case "checkbox":
          this.configFlags.push(value.checked ? 1 : 0);
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

    this.updateConfig();
  }

  private setParameters() {
    this.configItem_change();
    let urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.set("parameters", this.configFlags.join(""));
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
