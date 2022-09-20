import {Util} from "../util/Util.js";

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
    this.actionLabel = this.name;
    this.damageRange = damageRange;
    this.isGuided = isGuided;
    this.ambits = ambits;
    this.isMultiTarget = isMultiTarget;

    this.util = new Util();
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

  /**
   * @return {string}
   */
  getActionLabel() {
    return this.util.titleCase(this.actionLabel);
  }
}
