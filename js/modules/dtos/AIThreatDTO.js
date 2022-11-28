export class AIThreatDTO {
  /**
   * @param {Struct} attackingStruct
   * @param {number} cumulativeDamage
   */
  constructor(attackingStruct, cumulativeDamage) {
    this.attackingStruct = attackingStruct;
    this.cumulativeDamage = cumulativeDamage;
  }
}
