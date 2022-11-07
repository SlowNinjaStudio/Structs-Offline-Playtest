export class DamageResultDTO {
  /**
   * @param {number} incomingDamage
   * @param {number} finalDamage
   * @param {string} defenseComponentName
   */
  constructor(
    incomingDamage,
    finalDamage,
    defenseComponentName= '') {
    this.incomingDamage = incomingDamage;
    this.finalDamage = finalDamage;
    this.defenseComponentName = defenseComponentName;
    this.damageTaken = null;
  }
}
