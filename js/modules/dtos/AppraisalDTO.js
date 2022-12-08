export class AppraisalDTO {

  /**
   * @param {string} unitType
   * @param {number} price
   * @param {number} tacticalValue
   */
  constructor(unitType = '', price = 0, tacticalValue = 0) {
    this.unitType = unitType;
    this.price = price;
    this.tacticalValue = tacticalValue;
  }
}
