import {DEFENSE_COMPONENT_TYPES} from "../Constants.js";
import {Fraction} from "../util/Fraction.js";
import {Util} from "../util/Util.js";
import {DamageReductionResultDTO} from "../dtos/DamageReductionResultDTO.js";

export class DefenseComponent {

  /**
   * @param {string} type
   * @param {string} name
   * @param {boolean} isActive whether or not the component is active by default or if it has to be activated
   * @param {Fraction} probability
   */
  constructor(
    type = DEFENSE_COMPONENT_TYPES.DEFAULT,
    name = '',
    isActive = true,
    probability = new Fraction(1, 1),
  ) {
    this.type = type;
    this.name = name;
    this.actionLabel = this.name;
    this.isActive = isActive;
    this.probability = probability;

    this.util = new Util();
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
   * @param {string} currentAmbit
   * @param {string} desiredAmbit
   * @return {boolean}
   */
  canChangeAmbit(currentAmbit, desiredAmbit) {
    return false;
  }

  /**
   * For defense components that can evade counter-attacks.
   *
   * @return {boolean}
   */
  evadeCounterAttack() {
    return false;
  }

  /**
   * For defense components that reduce attack damage.
   *
   * @param {number} incomingDamage
   * @param {ManualWeapon} attackingWeapon
   * @return {DamageReductionResultDTO}
   */
  reduceAttackDamage(incomingDamage, attackingWeapon = null) {
    return new DamageReductionResultDTO(incomingDamage, incomingDamage);
  }

  /**
   * @return {string}
   */
  getActionLabel() {
    return this.util.titleCase(this.actionLabel);
  }
}
