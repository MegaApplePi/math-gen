import Prando from 'prando';
import * as katex from "katex";

enum eProblemType {
  Addition,
  Subtraction,
  Multiplication,
  Division,
  DivisionFractional
}

type tUniqueProblems = [
  eProblemType,
  number,
  number
];

class MathGen {
  private _prando: Prando;
  public get Prando(): Prando {
    return this._prando;
  }

  // The key is private (not printable), while the seed is public (will print).
  private _key: string;
  private _seed: string;
  private _answersMode: boolean;
  public parameters: string;
  public minNumber: number = 1;
  public maxNumber: number = 99;
  private ATTEMPT_LIMIT = 4; // NOTE This number limits the number of attempts to create a unique problem.
  private uniqueProblems: tUniqueProblems[] = [];

  public get answersMode(): boolean {
    return this._answersMode;
  };

  public get key() {
    return this._key;
  };
  public set key(key: any) {
    if (!this._key) {
      this._key = key.toString();
    } else {
      throw new Error("The key was already set. It cannot be set again.");
    }
  };

  public get seed() {
    return this._seed;
  };
  public set seed(seed: any) {
    if (!this._seed) {
      // NOTE Although Prando can accept numbers as a seed, I'll cast it as a string to keep it simple and because query strings are strings.
      this._seed = seed.toString();
    } else {
      throw new Error("The seed was already set. It cannot be set again.");
    }
  };

  constructor() {
    let urlSearchParams = new URLSearchParams(window.location.search);

    //TODO these should be done in the index.ts, not MathGen... MathGen should not be responsible for this kind of stuff.
    this._key = urlSearchParams.get("key") ?? new Prando().nextString(8);
    this._seed = urlSearchParams.get("seed")?.substr(0, 16) ?? new Prando().nextString(16);
    this.parameters = urlSearchParams.get("parameters") ?? "1111111111000z0";
    if(!/[0,1][0,1][0,1][0,1][0,1][0,1][0,1][0,1][0,1][0,1][0,1][0-z][0,1][0-z][0,1]/.test(this.parameters)) {
      this.parameters = "1111111111000z0";
    }

    this._answersMode = urlSearchParams.has("answers");

    this._prando = new Prando(this._key + this._seed);
  }

  public mkAddition(attempt: number = 1): string {
    let number1 = this._prando.nextInt(this.minNumber, this.maxNumber);
    let number2 = this._prando.nextInt(this.minNumber, this.maxNumber);

    let set: tUniqueProblems = [eProblemType.Multiplication, number1, number2];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkMultiplicationVertical(++attempt);

    this.uniqueProblems.push(set);

    if (this._answersMode)
      return `${number1} + ${number2} = \\boxed{${number1 + number2}}`;

    return `${number1} + ${number2} =`;
  }

  public mkAdditionVertical(attempt: number = 1): string {
    let number1 = this._prando.nextInt(this.minNumber, this.maxNumber);
    let number2 = this._prando.nextInt(this.minNumber, this.maxNumber);

    let set: tUniqueProblems = [eProblemType.Multiplication, number1, number2];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkMultiplicationVertical(++attempt);

    this.uniqueProblems.push(set);

    if (this._answersMode)
      return `\\begin{aligned}${number1}&\\cr\\underline{+\\enspace${number2}}&\\cr\\boxed{${number1 + number2}}&\\end{aligned}`;

    return `\\begin{aligned}${number1}& \\\\ \\underline{+\\enspace${number2}}&\\end{aligned}`;
  }

  public mkSubtraction(attempt: number = 1): string {
    let number1 = this._prando.nextInt(this.minNumber, this.maxNumber);
    let number2 = this._prando.nextInt(this.minNumber, this.maxNumber);

    let set: tUniqueProblems = [eProblemType.Multiplication, number1, number2];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkMultiplicationVertical(++attempt);

    this.uniqueProblems.push(set);

    if (this._answersMode)
      return `${number1} - ${number2} = \\boxed{${number1 - number2}}`;

    return `${number1} - ${number2} =`;
  }

  public mkSubtractionVertical(attempt: number = 1): string {
    let number1 = this._prando.nextInt(this.minNumber, this.maxNumber);
    let number2 = this._prando.nextInt(this.minNumber, this.maxNumber);

    let set: tUniqueProblems = [eProblemType.Multiplication, number1, number2];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkMultiplicationVertical(++attempt);

    this.uniqueProblems.push(set);

    if (this._answersMode)
      return `\\begin{aligned}${number1}&\\cr\\underline{-\\enspace${number2}}&\\cr\\boxed{${number1 - number2}}&\\end{aligned}`;

    return `\\begin{aligned}${number1}&\\cr\\underline{-\\enspace${number2}}&\\end{aligned}`;
  }

  public mkMultiplication(attempt: number = 1): string {
    let number1 = this._prando.nextInt(this.minNumber, this.maxNumber);
    let number2 = this._prando.nextInt(this.minNumber, this.maxNumber);

    let set: tUniqueProblems = [eProblemType.Multiplication, number1, number2];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkMultiplicationVertical(++attempt);

    this.uniqueProblems.push(set);

    if (this._answersMode)
      return `${number1} \\times ${number2} = \\boxed{${number1 * number2}}`;

    return `${number1} \\times ${number2} =`;
  }

  public mkMultiplicationVertical(attempt: number = 1): string {
    // let number1 = this._prando.nextInt(this.minNumber, this.maxNumber);
    // let number2 = this._prando.nextInt(this.minNumber, this.maxNumber);
    // let number1 = this._prando.nextArrayItem([6,7,8,9,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]);
    let number1 = this._prando.nextArrayItem([2,3,4,5,6,7,8,9,11,12]);
    let number2 = this._prando.nextArrayItem([11,12]);

    let set: tUniqueProblems = [eProblemType.Multiplication, number1, number2];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkMultiplicationVertical(++attempt);

    this.uniqueProblems.push(set);

    if (this._answersMode)
      return `${number1} \\times ${number2} = \\boxed{${number1 * number2}}`;

    return `\\begin{aligned}${number1}& \\\\ \\underline{\\times\\enspace${number2}}&\\end{aligned}`;
  }

  public mkDivision(attempt: number = 1): string {
    // let quotient = this._prando.nextInt(this.minNumber, this.maxNumber);
    // let divisor = this._prando.nextInt(this.minNumber, this.maxNumber);
    let quotient = this._prando.nextArrayItem([2,3,4,5,6,7,8,9,11,12]);
    let divisor = this._prando.nextArrayItem([2,3,4,5,6,7,8,9,11,12]);
    let dividend = quotient * divisor;

    let set: tUniqueProblems = [eProblemType.Division, quotient, divisor];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkMultiplicationVertical(++attempt);

    this.uniqueProblems.push(set);

    if (this._answersMode)
      return `${dividend} \\div ${divisor} = \\boxed{${quotient}}`;

    return `${dividend} \\div ${divisor} =`;
  }

  public mkDivisionLong(attempt: number = 1): string {
    // let quotient = this._prando.nextInt(this.minNumber, this.maxNumber);
    // let divisor = this._prando.nextInt(this.minNumber, this.maxNumber);
    let quotient = this._prando.nextArrayItem([2,3,4,5,6,7,8,9,11,12]);
    let divisor = this._prando.nextArrayItem([2,3,4,5,6,7,8,9,11,12]);
    let dividend = quotient * divisor;

    let set: tUniqueProblems = [eProblemType.Division, quotient, divisor];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkMultiplicationVertical(++attempt);

    this.uniqueProblems.push(set);

    if (this._answersMode)
      return `\\begin{aligned}\\boxed{${quotient}}&\\cr${divisor}\\thinspace\\overline{\\smash{)}\\thinspace${dividend}\\thinspace}\\end{aligned}`;

    return `\\space\\newline${divisor}\\thinspace\\overline{\\smash{)}\\thinspace${dividend}\\thinspace}`;
  }

  public mkDivisionWithFraction(attempt: number = 1): string {
    let dividend = this._prando.nextInt(this.minNumber, this.maxNumber);
    let divisor = this._prando.nextInt(this.minNumber, this.maxNumber);
    let quotient = Math.floor(dividend / divisor);
    let remainder = dividend % divisor;

    let set: tUniqueProblems = [eProblemType.Division, quotient, divisor];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkMultiplicationVertical(++attempt);

    this.uniqueProblems.push(set);

    if (this._answersMode)
      return `\\begin{aligned}\\boxed{${quotient}}&\\cr${divisor}\\thinspace\\overline{\\smash{)}\\thinspace${dividend}\\thinspace}\\end{aligned}`;

    if (this._answersMode) {
      if (!Number.isFinite(quotient))
        return `${dividend} \\div ${divisor} = \\boxed{\\small{undefined}}`;

      if (remainder === 0)
        return `${dividend} \\div ${divisor} = \\boxed{${quotient}}`;

      if (quotient === 0)
        return `${dividend} \\div ${divisor} = \\boxed{\\frac{${remainder}}{${divisor}}}`;

      return `${dividend} \\div ${divisor} = \\boxed{${quotient} \\frac{${remainder}}{${divisor}}}`;
    }
    return `${dividend} \\div ${divisor} =`;
  }

  public mkDivisionWithFractionLong(): string {
    let dividend = this._prando.nextInt(this.minNumber, this.maxNumber);
    let divisor = this._prando.nextInt(this.minNumber, this.maxNumber);
    let quotient = Math.floor(dividend / divisor);
    let remainder = dividend % divisor;

    if (this._answersMode) {
      if (!Number.isFinite(quotient))
        return `${dividend} \\div ${divisor} = \\boxed{\\small{undefined}}`;

      if (remainder === 0)
        return `${dividend} \\div ${divisor} = \\boxed{${quotient}}`;

      if (quotient === 0)
        return `${dividend} \\div ${divisor} = \\boxed{\\frac{${remainder}}{${divisor}}}`;

      return `${dividend} \\div ${divisor} = \\boxed{${quotient} \\frac{${remainder}}{${divisor}}}`;
    }
    return `${dividend} \\div ${divisor} =`;
  }

  // TODO maybe just have the mk functions do the render, rather than having an extra render method
  // The pattern is now:    MathGen.render(MathGen.mkAddition(), $div);
  // but it could just be:  MathGen.mkAddition($div);
  public render(tex: string, element: HTMLElement, options?: katex.KatexOptions) {
    katex.render(tex, element, options);
  }
}

export default new MathGen();
