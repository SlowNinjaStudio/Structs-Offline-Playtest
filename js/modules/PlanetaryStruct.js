import {Struct} from "./Struct.js";

export class PlanetaryStruct extends Struct {
  /**
   * @param {string} unitType
   * @param {string} operatingAmbit
   * @param {ManualWeapon} manualWeaponPrimary
   * @param {ManualWeapon} manualWeaponSecondary
   * @param {PassiveWeapon} passiveWeapon
   * @param {DefenseComponent} defenseComponent
   * @param {PowerGenerator} powerGenerator
   * @param {string} image
   */
  constructor(
    unitType,
    operatingAmbit,
    manualWeaponPrimary,
    manualWeaponSecondary,
    passiveWeapon = null,
    defenseComponent = null,
    powerGenerator = null,
    image = ''
  ) {
    super(
      unitType,
      operatingAmbit,
      manualWeaponPrimary,
      manualWeaponSecondary,
      passiveWeapon,
      defenseComponent,
      powerGenerator,
      image
    );
    this.canDefend = false;
    this.ambitSlot = -2;
  }

  /**
   * @return {boolean}
   */
  isPlanetaryStruct() {
    return true;
  }
}
