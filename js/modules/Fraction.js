export class Fraction {
  /**
   * @param {number} numerator
   * @param {number} denominator
   */
  constructor(numerator, denominator) {
    this.numerator = numerator;
    this.denominator = denominator;
  }

  /**
   * @return {number}
   */
  toDecimal() {
    return this.numerator / this.denominator;
  }

  /**
   * @return {string}
   */
  toString() {
    return `${this.numerator}/${this.denominator}`;
  }
}
