import {CONSTRAINTS} from "../Constants.js";
import {AttackStructConstraint} from "./AttackStructConstraint.js";
import {CommandStructBlockerConstraint} from "./CommandStructBlockerConstraint.js";
import {AIConstraintFactoryError} from "../errors/AIConstraintFactoryError.js";
import {GeneratorBlockerConstraint} from "./GeneratorBlockerConstraint.js";
import {CounterUnitAttackerConstraint} from "./CounterUnitAttackerConstraint.js";
import {AmbitCoverageConstraint} from "./AmbitCoverageConstraint.js";

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
      case CONSTRAINTS.AMBIT_COVERAGE:
        constraint = new AmbitCoverageConstraint(this.state);
        break;
      case CONSTRAINTS.ATTACK_STRUCT:
        constraint = new AttackStructConstraint(this.state);
        break;
      case CONSTRAINTS.COMMAND_STRUCT_BLOCKER:
        constraint = new CommandStructBlockerConstraint(this.state);
        break;
      case CONSTRAINTS.COUNTER_UNIT_ATTACKER:
        constraint = new CounterUnitAttackerConstraint(this.state);
        break;
      case CONSTRAINTS.GENERATOR_BLOCKER:
        constraint = new GeneratorBlockerConstraint(this.state);
        break;
      default:
        throw new AIConstraintFactoryError('Cannot make constraint, constraint does not exist.');
    }
    return constraint;
  }
}
