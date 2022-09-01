import {AMBITS, DEFENSE_COMPONENTS, FLEET_STRUCT_DEFAULTS} from "./Constants.js";
import {DefenseComponentFactoryError} from "./DefenseComponentFactoryError.js";
import {Armour} from "./Armour.js";
import {CounterMeasure} from "./CounterMeasure.js";
import {AmbitDefense} from "./AmbitDefense.js";
import {CounterAttackEvasion} from "./CounterAttackEvasion.js";
import {AftermarketEngine} from "./AftermarketEngine.js";
import {Fraction} from "./Fraction.js";

export class DefenseComponentFactory {
  /**
   * @param {string} componentName
   * @param {string[]} ambits
   * @return {DefenseComponent}
   */
  make(componentName, ambits = []) {
    let component = null;
    switch(componentName) {
      case DEFENSE_COMPONENTS.ARMOUR:
        component = this.makeArmour();
        break;
      case DEFENSE_COMPONENTS.DEFENSIVE_MANEUVER:
        component = this.makeDefensiveManeuver();
        break;
      case DEFENSE_COMPONENTS.INDIRECT_COMBAT_MODULE:
        component = this.makeIndirectCombatModule();
        break;
      case DEFENSE_COMPONENTS.OMNI_ENGINE:
        component = this.makeOmniEngine();
        break;
      case DEFENSE_COMPONENTS.SIGNAL_JAMMING:
        component = this.makeSignalJamming();
        break;
      case DEFENSE_COMPONENTS.STEALTH_MODE:
        component = this.makeStealthMode(ambits);
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
      new Fraction(2, 3),
      false
    );
  }

  /**
   * @return {DefenseComponent}
   */
  makeIndirectCombatModule() {
    return new CounterAttackEvasion(
      DEFENSE_COMPONENTS.INDIRECT_COMBAT_MODULE,
      new Fraction(1, 1)
    );
  }

  /**
   * @return {DefenseComponent}
   */
  makeOmniEngine() {
    return new AftermarketEngine(
      DEFENSE_COMPONENTS.OMNI_ENGINE,
      [AMBITS.WATER, AMBITS.LAND, AMBITS.SKY, AMBITS.SPACE],
    );
  }

  /**
   * @return {DefenseComponent}
   */
  makeSignalJamming() {
    return new CounterMeasure(
      DEFENSE_COMPONENTS.SIGNAL_JAMMING,
      new Fraction(2, 3),
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
}
