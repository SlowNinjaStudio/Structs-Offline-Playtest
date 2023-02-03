import {AIConstraint} from "./AIConstraint.js";
import {CONSTRAINTS} from "../Constants.js";

export class CommandStructBlockerConstraint extends AIConstraint {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    super(CONSTRAINTS.COMMAND_STRUCT_BLOCKER, state);
  }

  /**
   * @param {AIAttackParamsDTO} attackParams
   * @return {boolean}
   */
  isSatisfied(attackParams) {
    return this.state.enemy.commandStruct.countBlockingDefenders() > 0;
  }

  /**
   * @param {Struct} potentialStruct
   * @param {AIAttackParamsDTO} attackParams
   * @return {number}
   */
  couldSatisfy(potentialStruct, attackParams) {
    return potentialStruct.canTakeDamageFor(this.state.enemy.commandStruct) ? 1 : 0;
  }
}
