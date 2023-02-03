import {AIConstraint} from "./AIConstraint.js";
import {CONSTRAINTS} from "../Constants.js";

export class AttackStructConstraint extends AIConstraint {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    super(CONSTRAINTS.ATTACK_STRUCT, state);
  }

  /**
   * @param {AIAttackParamsDTO} attackParams
   * @return {boolean}
   */
  isSatisfied(attackParams) {
    return !!(!attackParams.attackingAIStruct.isCommandStruct()
      && attackParams.attackingAIStruct.canAttackAnyWeapon(attackParams.target));
  }

  /**
   * @param {Struct} potentialStruct
   * @param {AIAttackParamsDTO} attackParams
   * @return {number}
   */
  couldSatisfy(potentialStruct, attackParams) {
    return (!potentialStruct.isCommandStruct() && potentialStruct.canAttackAnyWeapon(attackParams.target)) ? 1 : 0;
  }
}
