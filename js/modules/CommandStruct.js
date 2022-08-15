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
   */
  constructor(
    unitType,
    operatingAmbit,
    manualWeaponPrimary,
    manualWeaponSecondary,
    passiveWeapon = null,
    defenseComponent = null
  ) {
    super(
      unitType,
      operatingAmbit,
      manualWeaponPrimary,
      manualWeaponSecondary,
      passiveWeapon,
      defenseComponent
    );
    this.maxHealth = COMMAND_STRUCT_DEFAULTS.MAX_HEALTH;
    this.currentHealth = this.maxHealth;
  }
}
