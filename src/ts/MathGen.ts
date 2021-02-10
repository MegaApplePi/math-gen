import Prando from 'prando';
import * as katex from 'katex';
import { Decimal } from 'decimal.js';
import Fraction from 'fraction.js';

enum eProblemType {
  Addition,
  Subtraction,
  Multiplication,
  Division,
  Long
}

type tUniqueProblems = [
  eProblemType,
  Decimal,
  Decimal,
  Decimal?,
  Decimal?
];

class MathGen {
  private _prando: Prando;
  public get Prando(): Prando {
    return this._prando;
  }

  public minNumber: number = 1;
  public maxNumber: number = 99;
  private readonly ATTEMPT_LIMIT = 4; // NOTE This limits the number of attempts to create a unique problem.
  private uniqueProblems: tUniqueProblems[] = [];

  constructor(key: string, seed: string) {
    this._prando = new Prando(key + seed);
  }

  public mkAdditionBasics(minNumber: number, maxNumber: number, useVertical: boolean, answers: boolean, attempt: number = 1): string {
    let number1 = new Decimal(this._prando.nextInt(minNumber, maxNumber));
    let number2 = new Decimal(this._prando.nextInt(minNumber, maxNumber));

    let set: tUniqueProblems = [eProblemType.Addition, number1, number2];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkAdditionBasics(minNumber, maxNumber, useVertical, answers, ++attempt);

    this.uniqueProblems.push(set);

    if (useVertical && answers)
      return String.raw`\begin{aligned}${number1}&\cr\underline{+\enspace${number2}}&\cr\boxed{${number1.add(number2)}}&\end{aligned}`;

    if (useVertical)
      return String.raw`\begin{aligned}${number1}& \\ \underline{+\enspace${number2}}&\end{aligned}`;

    if (answers)
      return String.raw`${number1} + ${number2} = \boxed{${number1.add(number2)}}`;

    return String.raw`${number1} + ${number2} =`;
  }

  public mkAdditionDecimals(minNumber: number, maxNumber: number, useVertical: boolean, placeValues: number, answers: boolean, attempt: number = 1): string {
    let number1 = new Decimal(Number(this._prando.next(minNumber, maxNumber).toFixed(placeValues)));
    let number2 = new Decimal(Number(this._prando.next(minNumber, maxNumber).toFixed(placeValues)));

    let set: tUniqueProblems = [eProblemType.Addition, number1, number2];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkAdditionDecimals(minNumber, maxNumber, useVertical, placeValues, answers, ++attempt);

    this.uniqueProblems.push(set);

    if (useVertical && answers)
      return String.raw`\begin{aligned}${number1.toFixed(placeValues)}&\cr\underline{+\enspace${number2.toFixed(placeValues)}}&\cr\boxed{${number1.add(number2).toFixed(placeValues)}}&\end{aligned}`;

    if (useVertical)
      return String.raw`\begin{aligned}${number1.toFixed(placeValues)}& \\ \underline{+\enspace${number2.toFixed(placeValues)}}&\end{aligned}`;

    if (answers)
      return String.raw`${number1} + ${number2} = \boxed{${number1.add(number2)}}`;

    return String.raw`${number1} + ${number2} =`;
  }

  public mkAdditionFractions(minNumerator: number, maxNumerator: number, minDenominator: number, maxDenominator: number, forceSameDenominator: boolean, answers: boolean, attempt: number = 1): string {
    let numerator1 = new Decimal(this._prando.nextInt(minNumerator, maxNumerator));
    let denominator1 = new Decimal(this._prando.nextInt(minDenominator, maxDenominator));
    let numerator2 = new Decimal(this._prando.nextInt(minNumerator, maxNumerator));
    let denominator2 = new Decimal(this._prando.nextInt(minDenominator, maxDenominator));

    if (forceSameDenominator) {
      denominator2 = denominator1;
    }

    let set: tUniqueProblems = [eProblemType.Addition, numerator1, denominator1, numerator2, denominator2];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkAdditionFractions(minNumerator, maxNumerator, minDenominator, maxDenominator, forceSameDenominator, answers, ++attempt);

    this.uniqueProblems.push(set);

    // TODO maybe add option to display mixed fractions as answers...
    if (answers) {
      let answer = new Fraction(numerator1.toNumber(), denominator1.toNumber()).add(new Fraction(numerator2.toNumber(), denominator2.toNumber())).toFraction().split("/");
      switch (answer.length) {
        case 1:
          return String.raw`\dfrac{${numerator1}}{${denominator1}} + \dfrac{${numerator2}}{${denominator2}} = \boxed{${answer[0]}}`;
        case 2:
          return String.raw`\dfrac{${numerator1}}{${denominator1}} + \dfrac{${numerator2}}{${denominator2}} = \boxed{\dfrac{${answer[0]}}{${answer[1]}}}`;
        // case 3:
        //   return String.raw`\dfrac{${numerator1}}{${denominator1}} + \dfrac{${numerator2}}{${denominator2}} = \boxed{${answer[0]}\dfrac{${answer[1]}}{${answer[2]}}}`;
      }
    }

    return String.raw`\dfrac{${numerator1}}{${denominator1}} + \dfrac{${numerator2}}{${denominator2}} = `;
  }

  public mkSubtractionBasics(minNumber: number, maxNumber: number, allowNegativeDifferences: boolean, useVertical: boolean, answers: boolean, attempt: number = 1): string {
    let number1 = new Decimal(this._prando.nextInt(this.minNumber, this.maxNumber));
    let number2 = new Decimal(this._prando.nextInt(this.minNumber, this.maxNumber));

    let set: tUniqueProblems = [eProblemType.Subtraction, number1, number2];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkSubtractionBasics(minNumber, maxNumber, allowNegativeDifferences, useVertical, answers, ++attempt);

    this.uniqueProblems.push(set);

    if (!allowNegativeDifferences && number1.minus(number2).lessThan(0))
      [number1, number2] = [number2, number1];

    if (useVertical && answers)
      return String.raw`\begin{aligned}${number1}&\cr\underline{-\enspace${number2}}&\cr\boxed{${number1.minus(number2)}}&\end{aligned}`;

    if (useVertical)
      return String.raw`\begin{aligned}${number1}& \\ \underline{-\enspace${number2}}&\end{aligned}`;

    if (answers)
      return String.raw`${number1} - ${number2} = \boxed{${number1.minus(number2)}}`;

    return String.raw`${number1} - ${number2} =`;
  }

  public mkSubtractionDecimals(minNumber: number, maxNumber: number, allowNegativeDifferences: boolean, useVertical: boolean, placeValues: number, answers: boolean, attempt: number = 1): string {
    let number1 = new Decimal(Number(this._prando.next(minNumber, maxNumber).toFixed(placeValues)));
    let number2 = new Decimal(Number(this._prando.next(minNumber, maxNumber).toFixed(placeValues)));

    let set: tUniqueProblems = [eProblemType.Subtraction, number1, number2];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkSubtractionDecimals(minNumber, maxNumber, allowNegativeDifferences, useVertical, placeValues, answers, ++attempt);

    this.uniqueProblems.push(set);

    if (!allowNegativeDifferences && number1.minus(number2).lessThan(0))
      [number1, number2] = [number2, number1];

    if (useVertical && answers)
      return String.raw`\begin{aligned}${number1.toFixed(placeValues)}&\cr\underline{-\enspace${number2.toFixed(placeValues)}}&\cr\boxed{${number1.minus(number2).toFixed(placeValues)}}&\end{aligned}`;

    if (useVertical)
      return String.raw`\begin{aligned}${number1.toFixed(placeValues)}& \\ \underline{-\enspace${number2.toFixed(placeValues)}}&\end{aligned}`;

    if (answers)
      return String.raw`${number1} - ${number2} = \boxed{${number1.minus(number2)}}`;

    return String.raw`${number1} - ${number2} =`;
  }

  public mkSubtractionFractions(minNumerator: number, maxNumerator: number, minDenominator: number, maxDenominator: number, allowNegativeDifferences: boolean, forceSameDenominator: boolean, answers: boolean, attempt: number = 1): string {
    let numerator1 = new Decimal(this._prando.nextInt(minNumerator, maxNumerator));
    let denominator1 = new Decimal(this._prando.nextInt(minDenominator, maxDenominator));
    let numerator2 = new Decimal(this._prando.nextInt(minNumerator, maxNumerator));
    let denominator2 = new Decimal(this._prando.nextInt(minDenominator, maxDenominator));

    if (forceSameDenominator) {
      denominator2 = denominator1;
    }

    let set: tUniqueProblems = [eProblemType.Subtraction, numerator1, denominator1, numerator2, denominator2];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkSubtractionFractions(minNumerator, maxNumerator, minDenominator, maxDenominator, allowNegativeDifferences, forceSameDenominator, answers, ++attempt);

    this.uniqueProblems.push(set);

    if (!allowNegativeDifferences && numerator1.dividedBy(denominator1).minus(numerator2.dividedBy(denominator2)).lessThan(0))
      [numerator1, denominator1, numerator2, denominator2] = [numerator2, denominator2, numerator1, denominator1];

    if (answers) {
      let answer = new Fraction(numerator1.toNumber(), denominator1.toNumber()).sub(new Fraction(numerator2.toNumber(), denominator2.toNumber())).toFraction().split("/");
      switch (answer.length) {
        case 1:
          return String.raw`\dfrac{${numerator1}}{${denominator1}} - \dfrac{${numerator2}}{${denominator2}} = \boxed{${answer[0]}}`;
        case 2:
          return String.raw`\dfrac{${numerator1}}{${denominator1}} - \dfrac{${numerator2}}{${denominator2}} = \boxed{\dfrac{${answer[0]}}{${answer[1]}}}`;
        // case 3:
        //   return String.raw`\dfrac{${numerator1}}{${denominator1}} - \dfrac{${numerator2}}{${denominator2}} = \boxed{${answer[0]}\dfrac{${answer[1]}}{${answer[2]}}}`;
      }
    }

    return String.raw`\dfrac{${numerator1}}{${denominator1}} - \dfrac{${numerator2}}{${denominator2}} = `;
  }

  public mkMultiplicationBasics(minNumber: number, maxNumber: number, useVertical: boolean, answers: boolean, attempt: number = 1): string {
    let number1 = new Decimal(this._prando.nextInt(this.minNumber, this.maxNumber));
    let number2 = new Decimal(this._prando.nextInt(this.minNumber, this.maxNumber));

    let set: tUniqueProblems = [eProblemType.Multiplication, number1, number2];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkMultiplicationBasics(minNumber, maxNumber, useVertical, answers, ++attempt);

    this.uniqueProblems.push(set);

    if (useVertical && answers)
      return String.raw`\begin{aligned}${number1}& \\ \underline{\times\enspace${number2}}& \\ \boxed{${number1.times(number2)}}&\end{aligned}`;

    if (useVertical)
      return String.raw`\begin{aligned}${number1}& \\ \underline{\times\enspace${number2}}&\end{aligned}`;

    if (answers)
      return String.raw`${number1} \times ${number2} = \boxed{${number1.times(number2)}}`;

    return String.raw`${number1} \times ${number2} =`;
  }

  public mkMultiplicationDecimals(minNumber: number, maxNumber: number, useVertical: boolean, placeValues: number, answers: boolean, attempt: number = 1): string {
    let number1 = new Decimal(Number(this._prando.next(minNumber, maxNumber).toFixed(placeValues)));
    let number2 = new Decimal(Number(this._prando.next(minNumber, maxNumber).toFixed(placeValues)));

    let set: tUniqueProblems = [eProblemType.Multiplication, number1, number2];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkMultiplicationDecimals(minNumber, maxNumber, useVertical, placeValues, answers, ++attempt);

    this.uniqueProblems.push(set);

    if (useVertical && answers)
      return String.raw`\begin{aligned}${number1}&\cr\underline{\times\enspace${number2}}&\cr\boxed{${number1.times(number2)}}&\end{aligned}`;

    if (useVertical)
      return String.raw`\begin{aligned}${number1}& \\ \underline{\times\enspace${number2}}&\end{aligned}`;

    if (answers)
      return String.raw`${number1} \times ${number2} = \boxed{${number1.times(number2)}}`;

    return String.raw`${number1} \times ${number2} =`;
  }

  public mkMultiplicationFractions(minNumerator: number, maxNumerator: number, minDenominator: number, maxDenominator: number, answers: boolean, attempt: number = 1): string {
    let numerator1 = new Decimal(this._prando.nextInt(minNumerator, maxNumerator));
    let denominator1 = new Decimal(this._prando.nextInt(minDenominator, maxDenominator));
    let numerator2 = new Decimal(this._prando.nextInt(minNumerator, maxNumerator));
    let denominator2 = new Decimal(this._prando.nextInt(minDenominator, maxDenominator));

    let set: tUniqueProblems = [eProblemType.Multiplication, numerator1, denominator1, numerator2, denominator2];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkMultiplicationFractions(minNumerator, maxNumerator, minDenominator, maxDenominator, answers, ++attempt);

    this.uniqueProblems.push(set);

    if (answers) {
      let answer = new Fraction(numerator1.toNumber(), denominator1.toNumber()).mul(new Fraction(numerator2.toNumber(), denominator2.toNumber())).toFraction().split("/");
      switch (answer.length) {
        case 1:
          return String.raw`\dfrac{${numerator1}}{${denominator1}} \times \dfrac{${numerator2}}{${denominator2}} = \boxed{${answer[0]}}`;
        case 2:
          return String.raw`\dfrac{${numerator1}}{${denominator1}} \times \dfrac{${numerator2}}{${denominator2}} = \boxed{\dfrac{${answer[0]}}{${answer[1]}}}`;
        // case 3:
        //   return String.raw`\dfrac{${numerator1}}{${denominator1}} \times \dfrac{${numerator2}}{${denominator2}} = \boxed{${answer[0]}\dfrac{${answer[1]}}{${answer[2]}}}`;
      }
    }

    return String.raw`\dfrac{${numerator1}}{${denominator1}} \times \dfrac{${numerator2}}{${denominator2}} = `;
  }

  public mkDivisionBasic(minDivisor: number, maxDivisor: number, minQuotient: number, maxQuotient: number, allowRemainders: boolean, answers: boolean, attempt: number = 1): string {
    let divisor = new Decimal(this._prando.nextInt(minDivisor, maxDivisor));
    let quotient = new Decimal(this._prando.nextInt(minQuotient, maxQuotient));
    let dividend = quotient.times(divisor);

    if (allowRemainders)
      dividend = dividend.add(quotient.minus(divisor).abs());

    let set: tUniqueProblems = [eProblemType.Division, quotient, divisor];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkDivisionBasic(minDivisor, maxDivisor, minQuotient, maxQuotient, allowRemainders, answers, ++attempt);

    this.uniqueProblems.push(set);

    if (allowRemainders && answers)
      return String.raw`${dividend} \div ${divisor} = \boxed{${dividend.dividedBy(divisor).floor()} \enspace r${dividend.modulo(divisor)}}`;

    if (answers)
      return String.raw`${dividend} \div ${divisor} = \boxed{${quotient}}`;

    return String.raw`${dividend} \div ${divisor} =`;
  }

  public mkDivisionDecimals(minDivisor: number, maxDivisor: number, minQuotient: number, maxQuotient: number, allowDecimalDivisor: boolean, placeValues: number, answers: boolean, attempt: number = 1): string {
    let divisor = new Decimal(this._prando.next(minDivisor, maxDivisor).toFixed(placeValues));
    let quotient = new Decimal(this._prando.next(minQuotient, maxQuotient).toFixed(placeValues));

    if (!allowDecimalDivisor)
      divisor = divisor.floor();

    let dividend = quotient.times(divisor);

    let set: tUniqueProblems = [eProblemType.Division, quotient, divisor];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkDivisionDecimals(minDivisor, maxDivisor, minQuotient, maxQuotient, allowDecimalDivisor, placeValues, answers, ++attempt);

    this.uniqueProblems.push(set);

    // if (allowRemainders && answers)
    //   return String.raw`${dividend} \div ${divisor} = \boxed{${dividend.dividedBy(divisor).floor()} \enspace r${dividend.modulo(divisor)}}`;

    if (answers)
      return String.raw`${dividend} \div ${divisor} = \boxed{${quotient}}`;

    return String.raw`${dividend} \div ${divisor} =`;
  }

  public mkDivisionFractions(minNumerator: number, maxNumerator: number, minDenominator: number, maxDenominator: number, answers: boolean, attempt: number = 1): string {
    let numerator1 = new Decimal(this._prando.nextInt(minNumerator, maxNumerator));
    let denominator1 = new Decimal(this._prando.nextInt(minDenominator, maxDenominator));
    let numerator2 = new Decimal(this._prando.nextInt(minNumerator, maxNumerator));
    let denominator2 = new Decimal(this._prando.nextInt(minDenominator, maxDenominator));

    let set: tUniqueProblems = [eProblemType.Division, numerator1, denominator1, numerator2, denominator2];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkDivisionFractions(minNumerator, maxNumerator, minDenominator, maxDenominator, answers, ++attempt);

    this.uniqueProblems.push(set);

    if (answers) {
      let answer = new Fraction(numerator1.toNumber(), denominator1.toNumber()).div(new Fraction(numerator2.toNumber(), denominator2.toNumber())).toFraction().split("/");
      switch (answer.length) {
        case 1:
          return String.raw`\dfrac{${numerator1}}{${denominator1}} \div \dfrac{${numerator2}}{${denominator2}} = \boxed{${answer[0]}}`;
        case 2:
          return String.raw`\dfrac{${numerator1}}{${denominator1}} \div \dfrac{${numerator2}}{${denominator2}} = \boxed{\dfrac{${answer[0]}}{${answer[1]}}}`;
        // case 3:
        //   return String.raw`\dfrac{${numerator1}}{${denominator1}} \div \dfrac{${numerator2}}{${denominator2}} = \boxed{${answer[0]}\dfrac{${answer[1]}}{${answer[2]}}}`;
      }
    }

    return String.raw`\dfrac{${numerator1}}{${denominator1}} \div \dfrac{${numerator2}}{${denominator2}} = `;
  }

  public mkLongBasics(minDivisor: number, maxDivisor: number, minQuotient: number, maxQuotient: number, allowRemainders: boolean, answers: boolean, attempt: number = 1): string {
    let divisor = new Decimal(this._prando.nextInt(minDivisor, maxDivisor));
    let quotient = new Decimal(this._prando.nextInt(minQuotient, maxQuotient));
    let dividend = quotient.times(divisor);

    if (allowRemainders)
      dividend = dividend.add(quotient.minus(divisor).abs());

    let set: tUniqueProblems = [eProblemType.Long, quotient, divisor];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkLongBasics(minDivisor, maxDivisor, minQuotient, maxQuotient, allowRemainders, answers, ++attempt);

    this.uniqueProblems.push(set);

    // FIXME KaTeX cannot align with boxes (within functions in general)... maybe don't bother with aligning it?
    if (allowRemainders && answers)
    return String.raw`\begin{aligned}\boxed{${dividend.dividedBy(divisor).floor()} \enspace r${dividend.modulo(divisor)}}&\cr${divisor}\thinspace\overline{\smash{)}\thinspace${dividend}\thinspace}\end{aligned}`;
    // return String.raw`\begin{aligned}${Math.floor(dividend / divisor)}& \enspace r${dividend % divisor}\cr${divisor}\thinspace\overline{\smash{)}\thinspace${dividend}\thinspace}\end{aligned}`;

    if (answers)
      return String.raw`\begin{aligned}\boxed{${quotient}}&\cr${divisor}\thinspace\overline{\smash{)}\thinspace${dividend}\thinspace}\end{aligned}`;

    return String.raw`\space\newline${divisor}\thinspace\overline{\smash{)}\thinspace${dividend}\thinspace}`;
  }

  public mkLongDecimals(minDivisor: number, maxDivisor: number, minQuotient: number, maxQuotient: number, allowDecimalDivisor: boolean, placeValues: number, answers: boolean, attempt: number = 1): string {
    let divisor = new Decimal(this._prando.next(minDivisor, maxDivisor).toFixed(placeValues));
    let quotient = new Decimal(this._prando.next(minQuotient, maxQuotient).toFixed(placeValues));

    if (!allowDecimalDivisor)
      divisor = divisor.floor();

    let dividend = quotient.times(divisor);

    let set: tUniqueProblems = [eProblemType.Division, quotient, divisor];
    if (attempt > this.ATTEMPT_LIMIT)
      return 'SKIP';

    if (this.uniqueProblems.filter(value => value.join() === set.join()).length > 0)
      return this.mkLongDecimals(minDivisor, maxDivisor, minQuotient, maxQuotient, allowDecimalDivisor, placeValues, answers, ++attempt);

    this.uniqueProblems.push(set);

    if (answers)
      return String.raw`\begin{aligned}\boxed{${quotient}}&\cr${divisor}\thinspace\overline{\smash{)}\thinspace${dividend}\thinspace}\end{aligned}`;

    return String.raw`\space\newline${divisor}\thinspace\overline{\smash{)}\thinspace${dividend}\thinspace}`;
  }

  // TODO maybe just have the mk functions do the render, rather than having an extra render method
  // The pattern is now:    MathGen.render(MathGen.mkAddition(), $div);
  // but it could just be:  MathGen.mkAddition($div);
  public render(tex: string, element: HTMLElement, options?: katex.KatexOptions) {
    katex.render(tex, element, options);
  }
}

export default MathGen;
