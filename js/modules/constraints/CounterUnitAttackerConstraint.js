import {AIConstraint} from "./AIConstraint.js";
import {CONSTRAINTS} from "../Constants.js";

export class CounterUnitAttackerConstraint extends AIConstraint {
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
    return !!(attackParams.attackingAIStruct.isCounterUnitTo(attackParams.target) &&
      attackParams.attackingAIStruct.canDefeatStructsCounterMeasure(attackParams.target));
  }

  /**
   * @param {Struct} potentialStruct
   * @param {AIAttackParamsDTO} attackParams
   * @return {number}
   */
  couldSatisfy(potentialStruct, attackParams) {
    return (potentialStruct.isCounterUnitTo(attackParams.target) &&
      potentialStruct.canDefeatStructsCounterMeasure(attackParams.target)) ? 1 : 0;
  }

  /**
   * @param {AIConstraintSatisfyingStructDTO} aiConstraintSatisfyingStructDTO
   * @param {AIAttackParamsDTO} attackParams
   */
  satisfyHelper(aiConstraintSatisfyingStructDTO, attackParams) {
    attackParams.attackingAIStruct = aiConstraintSatisfyingStructDTO.unit;
  }
}
