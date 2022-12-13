import {AMBITS} from "./Constants.js";
import {AppraisalDTO} from "./dtos/AppraisalDTO.js";

export class AppraisalAmbitSet {
  constructor() {
    Object.values(AMBITS).forEach(ambit => {
      this[ambit] = [];
    });
  }

  /**
   * @param {string} ambit
   * @return {AppraisalDTO}
   */
  getMostExpensiveForAmbit(ambit) {
    return this[ambit].reduce((max, appraisal) =>
       (appraisal.price > max.price) ? appraisal : max
    , new AppraisalDTO());
  }

  /**
   * @param {string} ambit
   * @return {number[]}
   */
  getPricesForAmbit(ambit) {
    return this[ambit].map(appraisal => appraisal.price);
  }

  /**
   * @param {string} ambit
   * @return {number[]}
   */
  getTacticalValuesForAmbit(ambit) {
    return this[ambit].map(appraisal => appraisal.tacticalValue);
  }
}
