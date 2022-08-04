import {DefenseComponent} from "./DefenseComponent.js";
import {DEFENSE_COMPONENT_TYPES} from "./Constants.js";

export class Armour extends DefenseComponent {
  /**
   * @param {string} name
   * @param {number} damageReduction
   */
  constructor(name, damageReduction) {
    super(DEFENSE_COMPONENT_TYPES.ARMOUR, name);
    this.damageReduction = damageReduction;
  }

  /**
   * @param {number} incomingDamage
   * @param {ManualWeapon} attackingWeapon
   * @return {number}
   */
  reduceAttackDamage(incomingDamage, attackingWeapon = null) {
    return Math.max(1, incomingDamage - this.damageReduction);
  }
}
