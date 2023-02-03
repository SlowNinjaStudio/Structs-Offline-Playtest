export class AIConstraint {
  /**
   * @param {GameState} state
   * @param {string} name
   */
  constructor(name, state) {
    this.name = name;
    this.state = state;
  }

  /**
   * @param {AIAttackParamsDTO} attackParams
   * @return {boolean}
   */
  isSatisfied(attackParams) {
    return false;
  }

  /**
   * @param {Struct} potentialStruct
   * @param {AIAttackParamsDTO} attackParams
   * @return {number}
   */
  couldSatisfy(potentialStruct, attackParams) {
    return 0;
  }
}
