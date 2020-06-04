import Prando from 'prando';

class MathGen {
  private Prando: Prando;
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
    this.Prando = new Prando(this._seed);
  }

  public mkAddition(vertical: boolean = false): string {
    if (vertical) {
      return `\\begin{aligned}${this.Prando.nextInt(1, 99)}& \\\\ \\underline{+ ${this.Prando.nextInt(1, 99)}}&\\end{aligned}`;
      // return `\\begin{aligned}${this.Prando.nextInt(1, 99)}& \\\\ \\underline{+ \\quad${this.Prando.nextInt(1, 99)}}&\\end{aligned}`;
    }
    return `${this.Prando.nextInt(1, 99)} + ${this.Prando.nextInt(1, 99)} =`;
  }

  public mkSubtraction(vertical: boolean = false): string {
    if (vertical) {
      return `\\begin{aligned}${this.Prando.nextInt(1, 99)}& \\\\ \\underline{- ${this.Prando.nextInt(1, 99)}}&\\end{aligned}`;
    }
    return `${this.Prando.nextInt(1, 99)} - ${this.Prando.nextInt(1, 99)} =`;
  }
}

export default new MathGen();
