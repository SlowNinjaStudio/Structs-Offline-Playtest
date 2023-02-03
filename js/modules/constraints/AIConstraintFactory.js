import {CONSTRAINTS} from "../Constants.js";
import {AttackStructConstraint} from "./AttackStructConstraint.js";
import {CommandStructBlockerConstraint} from "./CommandStructBlockerConstraint.js";
import {AIConstraintFactoryError} from "../errors/AIConstraintFactoryError.js";

export class AIConstraintFactory {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    this.state = state;
  }

  /**
   * @param {string} name
   * @return {AIConstraint}
   */
  make(name) {
    let constraint = null;
    switch (name) {
      case CONSTRAINTS.ATTACK_STRUCT:
        constraint = new AttackStructConstraint(this.state);
        break;
      case CONSTRAINTS.COMMAND_STRUCT_BLOCKER:
        constraint = new CommandStructBlockerConstraint(this.state);
        break;
      default:
        throw new AIConstraintFactoryError('Cannot make constraint, constraint does not exist.');
    }
    return constraint;
  }
}
