export class CounterUnitDTO {
  /**
   * @param {string} counters
   * @param {Struct} counterUnit
   * @param {AppraisalDTO} counterUnitAppraisal
   */
  constructor(counters, counterUnit, counterUnitAppraisal) {
    this.counters = counters;
    this.counterUnit = counterUnit;
    this.counterUnitAppraisal = counterUnitAppraisal;
  }
}
