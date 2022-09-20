import {ORDER_OF_AMBITS} from "../Constants.js";
import {Util} from "./Util.js";

export class AmbitsUtil {

  constructor() {
    this.util = new Util();
  }

  /**
   * @param {boolean} lowerCase
   * @return {string[]}
   */
  getAmbitsTopFirst(lowerCase = false) {
    const ambits = [...ORDER_OF_AMBITS].reverse();
    return lowerCase ? this.util.toLowerCaseArray(ambits) : ambits;
  }

  /**
   * @param {boolean} lowerCase
   * @return {string[]}
   */
  getAmbitsBottomFirst(lowerCase = false) {
    return lowerCase ? this.util.toLowerCaseArray(ORDER_OF_AMBITS) : ORDER_OF_AMBITS;
  }
}
