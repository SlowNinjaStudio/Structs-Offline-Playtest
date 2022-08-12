import {DEFENSE_COMPONENTS, FLEET_STRUCT_DEFAULTS} from "./Constants.js";
import {DefenseComponentFactoryError} from "./DefenseComponentFactoryError.js";
import {Armour} from "./Armour.js";
import {CounterMeasure} from "./CounterMeasure.js";
import {AmbitDefense} from "./AmbitDefense.js";
import {CounterAttackEvasion} from "./CounterAttackEvasion.js";

export class DefenseComponentFactory {
  /**
   * @param {string} componentName
   * @param {string[]} ambits
   * @return {DefenseComponent}
   */
  make(componentName, ambits= []) {
    let component = null;
    switch(componentName) {
      case DEFENSE_COMPONENTS.ARMOUR:
        component = this.makeArmour();
        break;
      case DEFENSE_COMPONENTS.DEFENSIVE_MANEUVER:
        component = this.makeDefensiveManeuver();
        break;
      case DEFENSE_COMPONENTS.SIGNAL_JAMMING:
        component = this.makeSignalJamming();
        break;
      case DEFENSE_COMPONENTS.STEALTH_MODE:
        component = this.makeStealthMode(ambits);
        break;
      case DEFENSE_COMPONENTS.SWIFT_BLOCK:
        component = this.makeSwiftBlock();
        break;
      default:
        throw new DefenseComponentFactoryError('Cannot make component, component does not exist.');
    }
    return component;
  }

  /**
   * @return {DefenseComponent}
   */
  makeArmour() {
    return new Armour(
      DEFENSE_COMPONENTS.ARMOUR,
      FLEET_STRUCT_DEFAULTS.ARMOUR,
    );
  }

  /**
   * @return {DefenseComponent}
   */
  makeDefensiveManeuver() {
    return new CounterMeasure(
      DEFENSE_COMPONENTS.DEFENSIVE_MANEUVER,
      2/3,
      false
    );
  }

  /**
   * @return {DefenseComponent}
   */
  makeSignalJamming() {
    return new CounterMeasure(
      DEFENSE_COMPONENTS.SIGNAL_JAMMING,
      2/3,
      true
    );
  }

  /**
   * @param {string[]} ambitsDefendedAgainst
   * @return {DefenseComponent}
   */
  makeStealthMode(ambitsDefendedAgainst) {
    return new AmbitDefense(
      DEFENSE_COMPONENTS.STEALTH_MODE,
      ambitsDefendedAgainst
    );
  }

  /**
   * @return {DefenseComponent}
   */
  makeSwiftBlock() {
    return new CounterAttackEvasion(
      DEFENSE_COMPONENTS.SWIFT_BLOCK,
      1
    );
  }
}
