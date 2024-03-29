import {StructBuilder} from "./StructBuilder.js";
import {DEFENSE_COMPONENT_TYPES, DEFENSE_COMPONENTS, PASSIVE_WEAPONS, UNITS_BY_AMBIT} from "./Constants.js";
import {AppraisalDTO} from "./dtos/AppraisalDTO.js";
import {AmbitsUtil} from "./util/AmbitsUtil.js";
import {AppraisalAmbitSet} from "./AppraisalAmbitSet.js";

export class Appraiser {
  constructor() {
    this.structBuilder = new StructBuilder();
    this.ambitsUtil = new AmbitsUtil();
  }

  /**
   * @param {string} unitType
   * @return {number}
   */
  calcUnitTypePrice(unitType) {
    let price = 0;

    const unit = this.structBuilder.make(unitType);
    const targetableAmbits = unit.getTargetableAmbits();
    const hasManualSecondaryWeapon = !!unit.manualWeaponSecondary;
    const hasDefenseComponent = unit.defenseComponent.type !== DEFENSE_COMPONENT_TYPES.DEFAULT;
    const hasSpecialPassiveWeapon = unit.hasPassiveWeapon() && unit.passiveWeapon.name !== PASSIVE_WEAPONS.COUNTER_ATTACK;

    price += targetableAmbits.length;
    price += hasManualSecondaryWeapon ? 1 : 0;
    price += hasDefenseComponent ? 1 : 0;
    price += hasSpecialPassiveWeapon ? 1 : 0;

    return price;
  }

  /**
   * @param {string} unitType
   * @return {number}
   */
  calcUnitTypeTacticalValue(unitType) {
    const unit = this.structBuilder.make(unitType);
    const targetableAmbits = unit.getTargetableAmbits();
    const hasIndirectCombatModule = unit.defenseComponent.name === DEFENSE_COMPONENTS.INDIRECT_COMBAT_MODULE;

    let value = 0.5;
    value += targetableAmbits.length;
    value += hasIndirectCombatModule ? 1 : 0;
    return value;
  }

  /**
   * @param {string} unitType
   * @return {AppraisalDTO}
   */
  appraise(unitType) {
    return new AppraisalDTO(
      unitType,
      this.calcUnitTypePrice(unitType),
      this.calcUnitTypeTacticalValue(unitType)
    );
  }

  /**
   * @param {string} ambit
   * @return {AppraisalDTO[]}
   */
  getUnitAppraisalsByAmbit(ambit) {
    return UNITS_BY_AMBIT.FLEET[ambit].map(unitType => this.appraise(unitType));
  }

  /**
   * @return {AppraisalAmbitSet}
   */
  getAllFleetUnitAppraisals() {
    const ambits = this.ambitsUtil.getAmbitsTopFirst();
    const appraisalSet = new AppraisalAmbitSet();
    ambits.forEach(ambit => {
      appraisalSet[ambit] = this.getUnitAppraisalsByAmbit(ambit);
    });
    return appraisalSet;
  }
}
