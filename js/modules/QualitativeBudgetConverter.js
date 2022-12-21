import {QUALITATIVE_BUDGETS} from "./Constants.js";
import {Util} from "./util/Util.js";

export class QualitativeBudgetConverter {
  constructor() {
    this.util = new Util();
  }

  /**
   * @param {string} qualitativeBudget
   * @return {number}
   */
  convertToNumber(qualitativeBudget) {
    const budgetRange = QUALITATIVE_BUDGETS[qualitativeBudget];
    return this.util.getRandomInt(budgetRange.MIN, budgetRange.MAX);
  }
}
