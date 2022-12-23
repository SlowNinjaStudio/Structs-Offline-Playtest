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
   * @return {string}
   */
  getBudgetUsageString() {
    return `${this.credits}/${this.budget}`;
  }
}
