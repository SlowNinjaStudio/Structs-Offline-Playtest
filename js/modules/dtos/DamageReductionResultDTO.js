export class DamageReductionResultDTO {
  /**
   * @param {number} incomingDamage
   * @param {number} finalDamage
   * @param {string} reducingComponentName
   */
  constructor(incomingDamage, finalDamage, reducingComponentName= '') {
    this.incomingDamage = incomingDamage;
    this.finalDamage = finalDamage;
    this.reducingComponentName = reducingComponentName;
  }
}
