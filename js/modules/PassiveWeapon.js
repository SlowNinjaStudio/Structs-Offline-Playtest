import {Fraction} from "./Fraction.js";

export class PassiveWeapon {
  /**
   * @param {string} name
   * @param {number} damage
   * @param {Fraction} probability
   * @param {Fraction} probabilityOnDeath
   */
  constructor(
    name,
    damage,
    probability,
    probabilityOnDeath = new Fraction(0, 1)
  ) {
    this.name = name
    this.damage = damage;
    this.probability = probability;
    this.probabilityOnDeath = probabilityOnDeath;
    this.damageSameAmbit = this.damage;
  }

  /**
   * @returns {number}
   */
  getDamageOnCounter(sameAmbit = false) {
    let damage = sameAmbit ? this.damageSameAmbit : this.damage;
    return (Math.random() < this.probability.toDecimal()) ? damage : 0;
  }

  /**
   * @returns {number}
   */
  getDamageOnDeath() {
    return Math.random() < this.probabilityOnDeath.toDecimal() ? this.damage : 0;
  }
}
