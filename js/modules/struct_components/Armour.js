import {DefenseComponent} from "./DefenseComponent.js";
import {DEFENSE_COMPONENT_TYPES} from "../Constants.js";
import {DamageResultDTO} from "../dtos/DamageResultDTO.js";

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
   * @return {DamageResultDTO}
   */
  reduceAttackDamage(incomingDamage, attackingWeapon = null) {
    const finalDamage = incomingDamage > 0 ? Math.max(1, incomingDamage - this.damageReduction) : 0;
    return new DamageResultDTO(incomingDamage, finalDamage, this.name);
  }
}
