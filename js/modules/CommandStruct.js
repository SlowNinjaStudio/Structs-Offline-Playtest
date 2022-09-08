import {Struct} from "./Struct.js";
import {COMMAND_STRUCT_DEFAULTS} from "./Constants.js";

export class CommandStruct extends Struct {
  /**
   * @param {string} unitType
   * @param {string} operatingAmbit
   * @param {ManualWeapon} manualWeaponPrimary
   * @param {ManualWeapon} manualWeaponSecondary
   * @param {PassiveWeapon} passiveWeapon
   * @param {DefenseComponent} defenseComponent
   * @param {string} image
   */
  constructor(
    unitType,
    operatingAmbit,
    manualWeaponPrimary,
    manualWeaponSecondary,
    passiveWeapon = null,
    defenseComponent = null,
    image = ''
  ) {
    super(
      unitType,
      operatingAmbit,
      manualWeaponPrimary,
      manualWeaponSecondary,
      passiveWeapon,
      defenseComponent,
      image
    );
    this.maxHealth = COMMAND_STRUCT_DEFAULTS.MAX_HEALTH;
    this.currentHealth = this.maxHealth;
    this.canDefend = false;
    this.ambitSlot = -1;
  }

  /**
   * @return {boolean}
   */
  isCommandStruct() {
    return true;
  }
}
