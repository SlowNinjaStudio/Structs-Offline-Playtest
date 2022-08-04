export class PassiveWeapon {
  /**
   * @param {string} name
   * @param {number} damage
   * @param {number} probability
   * @param {number} probabilityOnDeath
   */
  constructor(name, damage, probability, probabilityOnDeath = 0) {
    this.name = name
    this.damage = damage;
    this.probability = probability;
    this.probabilityOnDeath = probabilityOnDeath;
  }

  /**
   * @returns {number}
   */
  getDamageOnCounter() {
    return Math.random() < this.probability ? this.damage : 0;
  }

  /**
   * @returns {number}
   */
  getDamageOnDeath() {
    return Math.random() < this.probabilityOnDeath ? this.damage : 0;
  }
}
