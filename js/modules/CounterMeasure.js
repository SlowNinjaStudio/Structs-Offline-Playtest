import {DefenseComponent} from "./DefenseComponent.js";
import {DEFENSE_COMPONENT_TYPES} from "./Constants.js";

export class CounterMeasure extends DefenseComponent {
  /**
   * @param {string} name
   * @param {number} probability
   * @param {boolean} guided
   */
  constructor(name, probability, guided) {
    super(DEFENSE_COMPONENT_TYPES.COUNTER_MEASURE, name);
    this.probability = probability;
    this.guided = guided;
  }

  /**
   * @param {number} incomingDamage
   * @param {ManualWeapon} attackingWeapon
   * @return {number}
   */
  reduceAttackDamage(incomingDamage , attackingWeapon) {
    return (attackingWeapon.isGuided === this.guided && Math.random() < this.probability) ? 0 : incomingDamage;
  }
}
