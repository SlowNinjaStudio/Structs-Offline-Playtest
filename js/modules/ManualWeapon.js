export class ManualWeapon {
  /**
   * @param {string} name
   * @param {number[]} damageRange
   * @param {boolean} isGuided
   * @param {string[]} ambits
   * @param {boolean} isMultiTarget
   */
  constructor(name, damageRange, isGuided, ambits, isMultiTarget = false) {
    this.name = name;
    this.damageRange = damageRange;
    this.isGuided = isGuided;
    this.ambits = ambits;
    this.isMultiTarget = isMultiTarget;
  }

  /**
   * @returns {number}
   */
  getDamage() {
    let index = 0;
    if (this.damageRange.length > 1) {
      index = Math.floor(Math.random() * this.damageRange.length);
    }
    return this.damageRange[index];
  }

  /**
   * @param {string} ambit
   * @returns {boolean}
   */
  canTargetAmbit(ambit) {
    return this.ambits.includes(ambit);
  }
}
