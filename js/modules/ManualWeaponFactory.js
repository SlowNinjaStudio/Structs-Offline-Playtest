import {FLEET_STRUCT_DEFAULTS, MANUAL_WEAPON_CUSTOM_ACTION_LABELS, MANUAL_WEAPONS} from "./Constants.js";
import {ManualWeapon} from "./ManualWeapon.js";
import {ManualWeaponFactoryError} from "./ManualWeaponFactoryError.js";

export class ManualWeaponFactory {
  /**
   * @param {string} weaponName
   * @param {string[]} ambits
   * @return {ManualWeapon}
   */
  make(weaponName, ambits) {
    let weapon = null;
    switch(weaponName) {
      case MANUAL_WEAPONS.ATTACK_RUN:
        weapon = this.makeAttackRun(ambits);
        break;
      case MANUAL_WEAPONS.GUIDED_WEAPONRY:
        weapon = this.makeGuidedWeaponry(ambits);
        break;
      case MANUAL_WEAPONS.UNGUIDED_WEAPONRY:
        weapon = this.makeUnguidedWeaponry(ambits);
        break;
      case MANUAL_WEAPONS.SELF_DESTRUCT:
        throw new ManualWeaponFactoryError('Weapon not implemented.');
      default:
        throw new ManualWeaponFactoryError('Cannot make weapon, weapon does not exist.');
    }
    return weapon;
  }

  /**
   * @param {string[]} ambits
   * @return {ManualWeapon}
   */
  makeAttackRun(ambits) {
    return new ManualWeapon(
      MANUAL_WEAPONS.ATTACK_RUN,
      [1, 3],
      false,
      ambits
    );
  }

  /**
   * @param {string[]} ambits
   * @return {ManualWeapon}
   */
  makeGuidedWeaponry(ambits) {
    const weapon = new ManualWeapon(
      MANUAL_WEAPONS.GUIDED_WEAPONRY,
      [FLEET_STRUCT_DEFAULTS.ATTACK_DAMAGE],
      true,
      ambits
    );
    weapon.actionLabel = MANUAL_WEAPON_CUSTOM_ACTION_LABELS.GUIDED_WEAPONRY;
    return weapon;
  }

  /**
   * @param {string[]} ambits
   * @return {ManualWeapon}
   */
  makeUnguidedWeaponry(ambits) {
    const weapon = new ManualWeapon(
      MANUAL_WEAPONS.UNGUIDED_WEAPONRY,
      [FLEET_STRUCT_DEFAULTS.ATTACK_DAMAGE],
      false,
      ambits
    );
    weapon.actionLabel = MANUAL_WEAPON_CUSTOM_ACTION_LABELS.UNGUIDED_WEAPONRY;
    return weapon;
  }
}
