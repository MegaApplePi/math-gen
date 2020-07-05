import Prando from 'prando';

class MathGen {
  private _prando: Prando;
  public get Prando(): Prando {
    return this._prando;
  }

  private _seed: string;

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
    this._prando = new Prando(this._seed);
  }

  public mkAddition(): string {
    return `${this._prando.nextInt(1, 99)} + ${this._prando.nextInt(1, 99)} =`;
  }

  public mkAdditionVertical(): string {
    return `\\begin{aligned}${this._prando.nextInt(1, 99)}& \\\\ \\underline{+ ${this._prando.nextInt(1, 99)}}&\\end{aligned}`;
  }

  public mkSubtraction(): string {
    return `${this._prando.nextInt(1, 99)} - ${this._prando.nextInt(1, 99)} =`;
  }

  public mkSubtractionVertical(): string {
    return `\\begin{aligned}${this._prando.nextInt(1, 99)}& \\\\ \\underline{- ${this._prando.nextInt(1, 99)}}&\\end{aligned}`;
  }

  public mkMultiplication(): string {
    return `${this._prando.nextInt(1, 99)} \\times ${this._prando.nextInt(1, 99)} =`;
  }
}

export default new MathGen();
