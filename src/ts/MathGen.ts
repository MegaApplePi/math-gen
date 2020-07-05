import Prando from 'prando';

class MathGen {
  private _prando: Prando;
  public get Prando(): Prando {
    return this._prando;
  }

  private _seed: string;
  private answersMode: boolean;

  public get seed() {
    return this._seed;
  };
  public set seed(seed: any) {
    // although Prando can accept numbers as a seed,
    // we'll cast it to a string for simplicity sake and
    // because URL query strings are strings
    if (!this._seed) {
      this._seed = seed as string;
    } else {
      throw new Error("The seed was already set. It cannot be set again.");
    }
  };

  constructor() {
    let urlSearchParams = new URLSearchParams(window.location.search);

    this._seed = urlSearchParams.get("seed")?.substr(0, 16) ?? new Prando().nextString(16);
    this.answersMode = urlSearchParams.has("answers");
    this._prando = new Prando(this._seed);
  }

  public mkAddition(): string {
    let number1 = this._prando.nextInt(1, 99);
    let number2 = this._prando.nextInt(1, 99);
    if (this.answersMode) {
      return `${number1} + ${number2} = \\fcolorbox{#000}{transparent}{${number1 + number2}}`;
    }
    return `${number1} + ${number2} =`;
  }

  public mkAdditionVertical(): string {
    return `\\begin{aligned}${this._prando.nextInt(1, 99)}& \\\\ \\underline{+ ${this._prando.nextInt(1, 99)}}&\\end{aligned}`;
  }

  public mkSubtraction(): string {
    let number1 = this._prando.nextInt(1, 99);
    let number2 = this._prando.nextInt(1, 99);
    if (this.answersMode) {
      return `${number1} - ${number2} = \\fcolorbox{#000}{transparent}{${number1 - number2}}`;
    }
    return `${number1} - ${number2} =`;
  }

  public mkSubtractionVertical(): string {
    return `\\begin{aligned}${this._prando.nextInt(1, 99)}& \\\\ \\underline{- ${this._prando.nextInt(1, 99)}}&\\end{aligned}`;
  }

  public mkMultiplication(): string {
    let number1 = this._prando.nextInt(1, 99);
    let number2 = this._prando.nextInt(1, 99);
    if (this.answersMode) {
      return `${number1} \\times ${number2} = \\fcolorbox{#000}{transparent}{${number1 * number2}}`;
    }
    return `${number1} \\times ${number2} =`;
  }

  public mkDivision(): string {
    let number1 = this._prando.nextInt(1, 99);
    let number2 = this._prando.nextInt(1, 9);
    let quotient = number1 * number2;

    if (this.answersMode) {
      return `${quotient} \\div ${number2} = \\fcolorbox{#000}{transparent}{${number1}}`;
    }
    return `${quotient} \\div ${number2} =`;
  }
}

export default new MathGen();
