import {AMBITS, DEFENSE_COMPONENTS, IMG, MANUAL_WEAPONS, PASSIVE_WEAPONS, UNIT_TYPES} from "./Constants.js";
import {Struct} from "./Struct.js";
import {ManualWeaponFactory} from "./ManualWeaponFactory.js";
import {PassiveWeaponFactory} from "./PassiveWeaponFactory.js";
import {DefenseComponentFactory} from "./DefenseComponentFactory.js";
import {CommandStruct} from "./CommandStruct.js";
import {CommandStructBuilderError} from "./CommandStructBuilderError.js";

export class CommandStructBuilder {
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
      case UNIT_TYPES.COMMAND_SHIP:
        struct = this.makeCommandShip();
        break;
      default:
        throw new CommandStructBuilderError('Unknown command struct type.');
    }
    return struct;
  }

  /**
   * @return {CommandStruct}
   */
  makeCommandShip() {
    return new CommandStruct(
      UNIT_TYPES.COMMAND_SHIP,
      AMBITS.SPACE,
      this.manualWeaponFactory.make(
        MANUAL_WEAPONS.GUIDED_WEAPONRY,
        [AMBITS.WATER, AMBITS.LAND, AMBITS.SKY, AMBITS.SPACE]
      ),
      null,
      this.passiveWeaponFactory.make(PASSIVE_WEAPONS.STRONG_COUNTER_ATTACK),
      this.defenseComponentFactory.make(DEFENSE_COMPONENTS.OMNI_ENGINE),
      IMG.STRUCTS + 'command-ship.jpg'
    );
  }
}
