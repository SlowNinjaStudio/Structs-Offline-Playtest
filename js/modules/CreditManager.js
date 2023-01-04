import {QualitativeBudgetConverter} from "./QualitativeBudgetConverter.js";
import {QUALITATIVE_BUDGETS} from "./Constants.js";
import {CreditManagerError} from "./errors/CreditManagerError.js";

export class CreditManager {
  constructor() {
    this.qualitativeBudget = null;
    this.budget = null;
    this.credits = null;

    this.qualitativeBudgetConverter = new QualitativeBudgetConverter();
  }

  /**
   * @param {string} qualitativeBudget
   */
  setQualitativeBudget(qualitativeBudget) {
    qualitativeBudget = qualitativeBudget.toUpperCase();
    if (!QUALITATIVE_BUDGETS[qualitativeBudget]) {
      throw new CreditManagerError('Invalid qualitative budget');
    }

    this.qualitativeBudget = qualitativeBudget;
  }

  initFromQualitativeBudget() {
    this.budget = this.qualitativeBudgetConverter.convertToNumber(this.qualitativeBudget);
    this.credits = this.budget;
  }

  /**
   * @return {boolean}
   */
  hasBudgetAndCredits() {
    return this.budget !== null && this.credits !== null;
  }

  /**
   * @param {number} creditOffset
   * @return {string}
   */
  getBudgetUsageString(creditOffset = 0) {
    let creditOffsetString = '';

    if (creditOffset) {
      if (creditOffset > 0) {
        creditOffsetString = `+${creditOffset}`;
      } else {
        creditOffsetString = `-${creditOffset}`;
      }
    }

    return `${this.credits}${creditOffsetString}/${this.budget}`;
  }

  /**
   * @param {number} price
   */
  pay(price) {
    if (price > this.credits) {
      throw new CreditManagerError('Cannot pay, insufficient credits');
    }
    this.credits = this.credits - price;
  }

  /**
   * @param {number} amount
   */
  addCredits(amount) {
    this.credits += amount;
  }
}
