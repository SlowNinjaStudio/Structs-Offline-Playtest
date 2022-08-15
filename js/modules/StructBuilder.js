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
    let struct = null;
    switch(unitType) {
      case UNIT_TYPES.ARTILLERY:
        struct = this.makeArtillery();
        break;
      case UNIT_TYPES.COMMAND_SHIP:
        struct = this.makeCommandShip();
        break;
      case UNIT_TYPES.CRUISER:
        struct = this.makeCruiser();
        break;
      case UNIT_TYPES.DESTROYER:
        struct = this.makeDestroyer();
        break;
      case UNIT_TYPES.FIGHTER_JET:
        struct = this.makeFighterJet();
        break;
      case UNIT_TYPES.GALACTIC_BATTLESHIP:
        struct = this.makeGalacticBattleship();
        break;
      case UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR:
        struct = this.makeHighAltitudeInterceptor();
        break;
      case UNIT_TYPES.SAM_LAUNCHER:
        struct = this.makeSAMLauncher();
        break;
      case UNIT_TYPES.SPACE_FRIGATE:
        struct = this.makeSpaceFrigate();
        break;
      case UNIT_TYPES.STAR_FIGHTER:
        struct = this.makeStarFighter();
        break;
      case UNIT_TYPES.STEALTH_BOMBER:
        struct = this.makeStealthBomber();
        break;
      case UNIT_TYPES.SUB:
        struct = this.makeSub();
        break;
      case UNIT_TYPES.TANK:
        struct = this.makeTank();
        break;
      default:
        throw new StructBuilderError('Cannot make struct, unit type does not exist.');
    }
    return struct;
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
  makeCommandShip() {
    return new Struct(
      UNIT_TYPES.COMMAND_SHIP,
      AMBITS.SPACE,
      this.manualWeaponFactory.make(
        MANUAL_WEAPONS.GUIDED_WEAPONRY,
        [AMBITS.WATER, AMBITS.LAND, AMBITS.SKY, AMBITS.SPACE]
      ),
      null,
      this.passiveWeaponFactory.make(PASSIVE_WEAPONS.STRONG_COUNTER_ATTACK),
      this.defenseComponentFactory.make(DEFENSE_COMPONENTS.OMNI_ENGINE)
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

  /**
   * @return {Struct}
   */
  makeFighterJet() {
    return new Struct(
      UNIT_TYPES.FIGHTER_JET,
      AMBITS.SKY,
      this.manualWeaponFactory.make(
        MANUAL_WEAPONS.GUIDED_WEAPONRY,
        [AMBITS.SKY]
      ),
      null,
      this.passiveWeaponFactory.make(PASSIVE_WEAPONS.COUNTER_ATTACK),
      this.defenseComponentFactory.make(DEFENSE_COMPONENTS.SIGNAL_JAMMING)
    );
  }

  /**
   * @return {Struct}
   */
  makeGalacticBattleship() {
    return new Struct(
      UNIT_TYPES.GALACTIC_BATTLESHIP,
      AMBITS.SPACE,
      this.manualWeaponFactory.make(
        MANUAL_WEAPONS.UNGUIDED_WEAPONRY,
        [AMBITS.WATER, AMBITS.LAND, AMBITS.SPACE]
      ),
      null,
      this.passiveWeaponFactory.make(PASSIVE_WEAPONS.COUNTER_ATTACK),
      this.defenseComponentFactory.make(DEFENSE_COMPONENTS.SIGNAL_JAMMING)
    );
  }

  /**
   * @return {Struct}
   */
  makeHighAltitudeInterceptor() {
    return new Struct(
      UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
      AMBITS.SKY,
      this.manualWeaponFactory.make(
        MANUAL_WEAPONS.GUIDED_WEAPONRY,
        [AMBITS.SKY, AMBITS.SPACE]
      ),
      null,
      this.passiveWeaponFactory.make(PASSIVE_WEAPONS.COUNTER_ATTACK),
      this.defenseComponentFactory.make(DEFENSE_COMPONENTS.DEFENSIVE_MANEUVER)
    );
  }

  /**
   * @return {Struct}
   */
  makeSAMLauncher() {
    return new Struct(
      UNIT_TYPES.SAM_LAUNCHER,
      AMBITS.LAND,
      this.manualWeaponFactory.make(
        MANUAL_WEAPONS.GUIDED_WEAPONRY,
        [AMBITS.SKY, AMBITS.SPACE]
      ),
      null,
      this.passiveWeaponFactory.make(PASSIVE_WEAPONS.COUNTER_ATTACK)
    );
  }

  /**
   * @return {Struct}
   */
  makeSpaceFrigate() {
    return new Struct(
      UNIT_TYPES.SPACE_FRIGATE,
      AMBITS.SPACE,
      this.manualWeaponFactory.make(
        MANUAL_WEAPONS.GUIDED_WEAPONRY,
        [AMBITS.SKY, AMBITS.SPACE]
      ),
      null,
      this.passiveWeaponFactory.make(PASSIVE_WEAPONS.COUNTER_ATTACK)
    );
  }

  /**
   * @return {Struct}
   */
  makeStarFighter() {
    return new Struct(
      UNIT_TYPES.STAR_FIGHTER,
      AMBITS.SPACE,
      this.manualWeaponFactory.make(
        MANUAL_WEAPONS.GUIDED_WEAPONRY,
        [AMBITS.SPACE]
      ),
      this.manualWeaponFactory.make(
        MANUAL_WEAPONS.ATTACK_RUN,
        [AMBITS.SPACE]
      ),
      this.passiveWeaponFactory.make(PASSIVE_WEAPONS.COUNTER_ATTACK)
    );
  }

  /**
   * @return {Struct}
   */
  makeStealthBomber() {
    return new Struct(
      UNIT_TYPES.STEALTH_BOMBER,
      AMBITS.SKY,
      this.manualWeaponFactory.make(
        MANUAL_WEAPONS.GUIDED_WEAPONRY,
        [AMBITS.WATER, AMBITS.LAND]
      ),
      null,
      this.passiveWeaponFactory.make(PASSIVE_WEAPONS.COUNTER_ATTACK),
      this.defenseComponentFactory.make(
        DEFENSE_COMPONENTS.STEALTH_MODE,
        [AMBITS.WATER, AMBITS.LAND, AMBITS.SPACE]
      )
    );
  }

  /**
   * @return {Struct}
   */
  makeSub() {
    return new Struct(
      UNIT_TYPES.SUB,
      AMBITS.WATER,
      this.manualWeaponFactory.make(
        MANUAL_WEAPONS.GUIDED_WEAPONRY,
        [AMBITS.WATER, AMBITS.SPACE]
      ),
      null,
      this.passiveWeaponFactory.make(PASSIVE_WEAPONS.COUNTER_ATTACK),
      this.defenseComponentFactory.make(
        DEFENSE_COMPONENTS.STEALTH_MODE,
        [AMBITS.LAND, AMBITS.SKY, AMBITS.SPACE]
      )
    );
  }

  /**
   * @return {Struct}
   */
  makeTank() {
    return new Struct(
      UNIT_TYPES.TANK,
      AMBITS.LAND,
      this.manualWeaponFactory.make(
        MANUAL_WEAPONS.UNGUIDED_WEAPONRY,
        [AMBITS.LAND]
      ),
      null,
      this.passiveWeaponFactory.make(PASSIVE_WEAPONS.COUNTER_ATTACK),
      this.defenseComponentFactory.make(DEFENSE_COMPONENTS.ARMOUR)
    );
  }
}
