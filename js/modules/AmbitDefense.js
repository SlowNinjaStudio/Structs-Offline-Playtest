import {DefenseComponent} from "./DefenseComponent.js";
import {DEFENSE_COMPONENT_TYPES} from "./Constants.js";

export class AmbitDefense extends DefenseComponent {
  /**
   * @param {string} name
   * @param {string[]} ambitsDefendedAgainst
   */
  constructor(name, ambitsDefendedAgainst) {
    super(DEFENSE_COMPONENT_TYPES.AMBIT_DEFENSE, name, false);
    this.ambitsDefendedAgainst = ambitsDefendedAgainst;
  }

  /**
   * @param {Struct} attacker
   * @return {boolean}
   */
  blocksTargeting(attacker) {
    return this.isActive && this.ambitsDefendedAgainst.includes(attacker.operatingAmbit);
  }

  /**
   * @return {string}
   */
  getActionLabel() {
    const activateDeactivate = this.isActive ? 'Deactivate' : 'Activate';
    return this.util.titleCase(`${activateDeactivate} ${this.actionLabel}`);
  }
}
