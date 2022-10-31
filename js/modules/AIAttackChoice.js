export class AIAttackChoice {
  /**
   * @param {Struct} attackStruct
   * @param {string} weaponSlot
   * @param {Struct} targetStruct
   */
  constructor(attackStruct, weaponSlot, targetStruct) {
    this.attackStruct = attackStruct;
    this.weaponSlot = weaponSlot;
    this.targetStruct = targetStruct;
  }
}
