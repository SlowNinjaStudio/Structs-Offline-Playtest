export class AIAttackParamsDTO {
  /**
   * @param {Struct} target
   * @param {Struct} attackingAIStruct
   */
  constructor(target, attackingAIStruct) {
    this.target = target;
    this.attackingAIStruct = attackingAIStruct;
  }
}
