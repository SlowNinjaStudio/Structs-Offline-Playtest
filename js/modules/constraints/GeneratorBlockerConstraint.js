import {AIConstraint} from "./AIConstraint.js";
import {CONSTRAINTS} from "../Constants.js";

export class GeneratorBlockerConstraint extends AIConstraint {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    super(CONSTRAINTS.GENERATOR_BLOCKER, state);
  }

  /**
   * @param {AIAttackParamsDTO} attackParams
   * @return {boolean}
   */
  isSatisfied(attackParams) {
    const generator = this.state.enemy.planet.findGenerator();
    return !generator || generator.isDestroyed || (generator.countBlockingDefenders() > 0);
  }

  /**
   * @param {Struct} potentialStruct
   * @param {AIAttackParamsDTO} attackParams
   * @return {number}
   */
  couldSatisfy(potentialStruct, attackParams) {
    const generator = this.state.enemy.planet.findGenerator();
    return (!generator || generator.isDestroyed || potentialStruct.canTakeDamageFor(generator)) ? 1 : 0;
  }

  /**
   * @param {AIConstraintSatisfyingStructDTO} aiConstraintSatisfyingStructDTO
   * @param {AIAttackParamsDTO} attackParams
   */
  satisfyHelper(aiConstraintSatisfyingStructDTO, attackParams) {
    const generator = this.state.enemy.planet.findGenerator();
    aiConstraintSatisfyingStructDTO.unit.defend(generator);
  }
}
