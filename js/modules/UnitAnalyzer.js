import {StructBuilder} from "./StructBuilder.js";
import {UNIT_TYPES, VIP_UNIT_TYPES} from "./Constants.js";
import {Appraiser} from "./Appraiser.js";
import {CounterUnitsMap} from "./CounterUnitsMap.js";
import {CounterUnitDTO} from "./CounterUnitDTO.js";

export class UnitAnalyzer {
  constructor() {
    this.structBuilder = new StructBuilder();
    this.appraiser = new Appraiser();
    this.counterUnitsMap = new CounterUnitsMap();
  }

  /**
   * @return {Struct[]}
   */
  getAllFleetUnits() {
    const units = [];
    Object.values(UNIT_TYPES).forEach(unitType => {
      if (!VIP_UNIT_TYPES.includes(unitType)) {
        units.push(this.structBuilder.make(unitType));
      }
    });
    return units;
  }

  /**
   * @return {CounterUnitsMap}
   */
  getCounterUnitsMap() {
    if (this.counterUnitsMap.map.size > 0) {
      return this.counterUnitsMap;
    }

    const units = this.getAllFleetUnits();

    units.forEach(unit => {
      units.forEach(counterUnit => {
        if (counterUnit.canAttackAnyWeapon(unit) && !unit.canCounterAttack(counterUnit)) {
          this.counterUnitsMap.addCounterUnit(new CounterUnitDTO(
            unit.unitType,
            counterUnit,
            this.appraiser.appraise(counterUnit.unitType)
          ));
        }
      })
    });

    return this.counterUnitsMap;
  }
}
