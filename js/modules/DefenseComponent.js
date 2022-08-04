import {DEFENSE_COMPONENT_TYPES} from "./Constants.js";

export class DefenseComponent {

  /**
   * @param {string} type
   * @param {string} name
   * @param {boolean} isActive whether or not the component is active by default or if it has to be activated
   */
  constructor(
    type= DEFENSE_COMPONENT_TYPES.DEFAULT,
    name= '',
    isActive = true
  ) {
    this.type = type;
    this.name = name;
    this.isActive = isActive;
  }

  /**
   * For defense components that block targeting.
   *
   * @param {Struct} attacker
   * @return {boolean}
   */
  blocksTargeting(attacker) {
    return false;
  }

  /**
   * For defense components that can evade counter-attacks.
   */
  evadeCounterAttack() {
    return false;
  }

  /**
   * For defense components that reduce attack damage.
   *
   * @param {number} incomingDamage
   * @param {ManualWeapon} attackingWeapon
   * @return {number}
   */
  reduceAttackDamage(incomingDamage, attackingWeapon = null) {
    return incomingDamage;
  }
}
