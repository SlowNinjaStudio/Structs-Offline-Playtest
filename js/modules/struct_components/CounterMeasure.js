import {DefenseComponent} from "./DefenseComponent.js";
import {DEFENSE_COMPONENT_TYPES} from "../Constants.js";
import {DamageResultDTO} from "../dtos/DamageResultDTO.js";

export class CounterMeasure extends DefenseComponent {
  /**
   * @param {string} name
   * @param {Fraction} probability
   * @param {boolean} guided
   */
  constructor(name, probability, guided) {
    super(DEFENSE_COMPONENT_TYPES.COUNTER_MEASURE, name, true, probability);
    this.guided = guided;
  }

  /**
   * @param {number} incomingDamage
   * @param {ManualWeapon} attackingWeapon
   * @return {DamageResultDTO}
   */
  reduceAttackDamage(incomingDamage , attackingWeapon) {
    const finalDamage = (
      attackingWeapon !== null
      && attackingWeapon.isGuided === this.guided
      && Math.random() < this.probability.toDecimal()
    ) ? 0 : incomingDamage;
    return new DamageResultDTO(incomingDamage, finalDamage, this.name);
  }
}
