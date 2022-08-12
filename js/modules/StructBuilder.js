import {AMBITS, DEFENSE_COMPONENTS, MANUAL_WEAPONS, PASSIVE_WEAPONS, UNIT_TYPES} from "./Constants.js";
import {Struct} from "./Struct.js";
import {ManualWeaponFactory} from "./ManualWeaponFactory.js";
import {PassiveWeaponFactory} from "./PassiveWeaponFactory.js";
import {DefenseComponentFactory} from "./DefenseComponentFactory.js";
import {StructBuilderError} from "./StructBuilderError.js";

export class StructBuilder {
  constructor() {
    this.defenseComponentFactory = new DefenseComponentFactory();
    this.manualWeaponFactory = new ManualWeaponFactory();
    this.passiveWeaponFactory = new PassiveWeaponFactory();
  }

  /**
   * @param {string} unitType
   * @return {Struct}
   */
  make(unitType) {
    let weapon = null;
    switch(unitType) {
      case UNIT_TYPES.ARTILLERY:
        weapon = this.makeArtillery();
        break;
      case UNIT_TYPES.CRUISER:
        weapon = this.makeCruiser();
        break;
      case UNIT_TYPES.DESTROYER:
        weapon = this.makeDestroyer();
        break;
      default:
        throw new StructBuilderError('Cannot make struct, unit type does not exist.');
    }
    return weapon;
  }

  /**
   * @return {Struct}
   */
  makeArtillery() {
    return new Struct(
      UNIT_TYPES.ARTILLERY,
      AMBITS.LAND,
      this.manualWeaponFactory.make(
        MANUAL_WEAPONS.UNGUIDED_WEAPONRY,
        [AMBITS.WATER, AMBITS.LAND]
      ),
      null,
      null,
      this.defenseComponentFactory.make(DEFENSE_COMPONENTS.INDIRECT_COMBAT_MODULE)
    );
  }

  /**
   * @return {Struct}
   */
  makeCruiser() {
    return new Struct(
      UNIT_TYPES.CRUISER,
      AMBITS.WATER,
      this.manualWeaponFactory.make(
        MANUAL_WEAPONS.GUIDED_WEAPONRY,
        [AMBITS.WATER, AMBITS.LAND]
      ),
      this.manualWeaponFactory.make(
        MANUAL_WEAPONS.UNGUIDED_WEAPONRY,
        [AMBITS.SKY]
      ),
      this.passiveWeaponFactory.make(PASSIVE_WEAPONS.COUNTER_ATTACK),
      this.defenseComponentFactory.make(DEFENSE_COMPONENTS.SIGNAL_JAMMING)
    );
  }

  /**
   * @return {Struct}
   */
  makeDestroyer() {
    return new Struct(
      UNIT_TYPES.DESTROYER,
      AMBITS.WATER,
      this.manualWeaponFactory.make(
        MANUAL_WEAPONS.GUIDED_WEAPONRY,
        [AMBITS.WATER, AMBITS.SKY]
      ),
      null,
      this.passiveWeaponFactory.make(PASSIVE_WEAPONS.ADVANCED_COUNTER_ATTACK)
    );
  }
}
