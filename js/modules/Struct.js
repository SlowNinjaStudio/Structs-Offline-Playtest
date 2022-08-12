import {FLEET_STRUCT_DEFAULTS, MANUAL_WEAPON_SLOTS} from "./Constants.js";
import {DefenseComponent} from "./DefenseComponent.js";
import {PassiveWeapon} from "./PassiveWeapon.js";

export class Struct {
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
    this.id = this.generateId();
    this.unitType = unitType;
    this.operatingAmbit = operatingAmbit;
    this.maxHealth = FLEET_STRUCT_DEFAULTS.MAX_HEALTH;
    this.currentHealth = this.maxHealth;
    this.defenders = [];
    this.defending = null;
    this.isDestroyed = false;

    this.manualWeaponPrimary = manualWeaponPrimary;
    this.manualWeaponSecondary = manualWeaponSecondary;
    this.passiveWeapon = passiveWeapon;
    this.defenseComponent = defenseComponent ? defenseComponent : new DefenseComponent();
  }

  /**
   * @returns {string}
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  /**
   * @param {Struct} struct
   */
  addDefender(struct) {
    this.defenders.push(struct);
  }

  /**
   * @param {Struct} struct
   */
  removeDefender(struct) {
    this.defenders = this.defenders.filter(defender => defender.id !== struct.id);
  }

  clearDefending() {
    this.defending = null;
  }

  removeAllDefenders() {
    for (let i = 0; i < this.defenders.length; i++) {
      this.defenders[i].clearDefending();
    }
    this.defenders = [];
  }

  undefend() {
    if (this.defending) {
      this.defending.removeDefender(this);
      this.clearDefending();
    }
  }

  /**
   * @param {Struct} struct
   */
  defend(struct) {
    this.undefend();
    struct.addDefender(this);
    this.defending = struct;
  }

  /**
   * @param {number} newHealth
   */
  setCurrentHealth(newHealth) {
    this.currentHealth = Math.max(0, newHealth);
  }

  destroyStruct() {
    this.isDestroyed = true;
    this.removeAllDefenders();
    this.undefend();
  }

  /**
   * @param {number} damage
   * @param {Struct} attacker
   */
  takeDamage(damage, attacker = null) {
    this.setCurrentHealth(this.currentHealth - this.defenseComponent.reduceAttackDamage(damage));
    if (this.currentHealth === 0) {
      this.destroyStruct();

      // Counter Attack on Death
      if (this.hasPassiveWeapon() && attacker && !attacker.isDestroyed) {
        attacker.takeDamage(this.passiveWeapon.getDamageOnDeath());
      }
    }
  }

  /**
   * @param {ManualWeapon} weapon
   * @param {Struct} struct
   * @returns {boolean}
   */
  canAttack(weapon, struct) {
    return !this.isDestroyed
      && !struct.isDestroyed
      && weapon.canTargetAmbit(struct.operatingAmbit)
      && !struct.defenseComponent.blocksTargeting(this);
  }

  /**
   * @param {string} ambit
   * @returns {boolean}
   */
  canTargetAmbit(ambit) {
    return !!((this.manualWeaponPrimary && this.manualWeaponPrimary.canTargetAmbit(ambit))
      || (this.manualWeaponSecondary && this.manualWeaponSecondary.canTargetAmbit(ambit)));
  }

  /**
   * @param {Struct} target
   * @returns {boolean}
   */
  canCounterAttack(target) {
    return !this.isDestroyed
      && !target.isDestroyed
      && this.canTargetAmbit(target.operatingAmbit)
      && this.hasPassiveWeapon()
      && !target.defenseComponent.evadeCounterAttack();
  }

  /**
   * @param {Struct} struct
   * @returns {boolean}
   */
  canTakeDamageFor(struct) {
    return !this.isDestroyed
      && !struct.isDestroyed
      && this.operatingAmbit === struct.operatingAmbit;
  }

  /**
   * @param {string} weaponSlot
   * @returns {ManualWeapon}
   */
  getManualWeapon(weaponSlot) {
    if (weaponSlot.toUpperCase() === MANUAL_WEAPON_SLOTS.PRIMARY) {
      return this.manualWeaponPrimary;
    } else if (weaponSlot.toUpperCase() === MANUAL_WEAPON_SLOTS.SECONDARY) {
      return this.manualWeaponSecondary;
    } else {
      throw new Error('Invalid weapon slot');
    }
  }

  /**
   * @returns {boolean}
   */
  hasPassiveWeapon() {
    return !!this.passiveWeapon;
  }

  /**
   * @param {Struct} attacker
   * @param {ManualWeapon} attackingWeapon
   * @param {Struct} target
   * @return {boolean} whether or not the attack was blocked
   */
  blockAttack(attacker, attackingWeapon, target) {
    if (this.canTakeDamageFor(target)) {
      this.takeDamage(attackingWeapon.getDamage(), attacker);
      return true;
    }
    return false;
  }

  /**
   * @param {Struct} target
   */
  counterAttack(target) {
    if (this.canCounterAttack(target)) {
      target.takeDamage(this.passiveWeapon.getDamageOnCounter(this.operatingAmbit === target.operatingAmbit), this);
      return true;
    }
    return false;
  }

  /**
   * @param {string} weaponSlot
   * @param {Struct} target
   */
  attack(weaponSlot, target) {
    let attackBlocked = false;
    const attackingWeapon = this.getManualWeapon(weaponSlot);

    if (!this.canAttack(attackingWeapon, target)) {
      return;
    }

    for (let i = 0; i < target.defenders.length; i++) {
      // Defender Block
      if (!attackBlocked) {
        attackBlocked = target.defenders[i].blockAttack(this, attackingWeapon, target);
      }

      // Defender Counter Attack
      target.defenders[i].counterAttack(this);

      if (this.isDestroyed) {
        return;
      }
    }

    // Attack
    if (!attackBlocked) {
      target.takeDamage(attackingWeapon.getDamage(), this);
    }

    // Counter Attack
    target.counterAttack(this);
  }
}
