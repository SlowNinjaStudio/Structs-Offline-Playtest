import {COMMAND_STRUCT_DEFAULTS, FLEET_STRUCT_DEFAULTS, PASSIVE_WEAPONS} from "./Constants.js";
import {PassiveWeaponFactoryError} from "./PassiveWeaponFactoryError.js";
import {PassiveWeapon} from "./PassiveWeapon.js";

export class PassiveWeaponFactory {
  /**
   * @param {string} weaponName
   * @return {PassiveWeapon}
   */
  make(weaponName) {
    let weapon = null;
    switch(weaponName) {
      case PASSIVE_WEAPONS.ADVANCED_COUNTER_ATTACK:
        weapon = this.makeAdvancedCounterAttack();
        break;
      case PASSIVE_WEAPONS.COUNTER_ATTACK:
        weapon = this.makeCounterAttack();
        break;
      case PASSIVE_WEAPONS.LAST_RESORT:
        weapon = this.makeLastResort();
        break;
      case PASSIVE_WEAPONS.STRONG_COUNTER_ATTACK:
        weapon = this.makeStrongCounterAttack();
        break;
      default:
        throw new PassiveWeaponFactoryError('Cannot make weapon, weapon does not exist.');
    }
    return weapon;
  }

  /**
   * @return {PassiveWeapon}
   */
  makeAdvancedCounterAttack() {
    const weapon = new PassiveWeapon(
      PASSIVE_WEAPONS.ADVANCED_COUNTER_ATTACK,
      FLEET_STRUCT_DEFAULTS.COUNTER_ATTACK_DAMAGE,
      1,
      0
    );
    weapon.damageSameAmbit = FLEET_STRUCT_DEFAULTS.ATTACK_DAMAGE;
    return weapon;
  }

  /**
   * @return {PassiveWeapon}
   */
  makeCounterAttack() {
    return new PassiveWeapon(
      PASSIVE_WEAPONS.COUNTER_ATTACK,
      FLEET_STRUCT_DEFAULTS.COUNTER_ATTACK_DAMAGE,
      1,
      0
    );
  }

  /**
   * @return {PassiveWeapon}
   */
  makeLastResort() {
    return new PassiveWeapon(
      PASSIVE_WEAPONS.LAST_RESORT,
      FLEET_STRUCT_DEFAULTS.ATTACK_DAMAGE,
      0,
      1
    );
  }

  /**
   * @return {PassiveWeapon}
   */
  makeStrongCounterAttack() {
    return new PassiveWeapon(
      PASSIVE_WEAPONS.STRONG_COUNTER_ATTACK,
      COMMAND_STRUCT_DEFAULTS.COUNTER_ATTACK_DAMAGE,
      1,
      0
    );
  }
}
