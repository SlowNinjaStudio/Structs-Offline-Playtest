import {DefenseComponent} from "./DefenseComponent.js";
import {DEFENSE_COMPONENT_TYPES} from "./Constants.js";

export class CounterAttackEvasion extends DefenseComponent {
  /**
   * @param {string} name
   * @param {number} probability
   */
  constructor(name, probability) {
    super(DEFENSE_COMPONENT_TYPES.EVADE_COUNTER_ATTACK, name, true, probability);
  }

  /**
   * @return {boolean}
   */
  evadeCounterAttack() {
    return Math.random() < this.probability;
  }
}
