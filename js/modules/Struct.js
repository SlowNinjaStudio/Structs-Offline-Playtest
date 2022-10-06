import {DEFENSE_COMPONENTS, EVENTS, FLEET_STRUCT_DEFAULTS, MANUAL_WEAPON_SLOTS, STRUCT_DEFAULTS} from "./Constants.js";
import {DefenseComponent} from "./struct_components/DefenseComponent.js";
import {PassiveWeapon} from "./struct_components/PassiveWeapon.js";
import {DefendActionDisabledError} from "./errors/DefendActionDisabledError.js";
import {InvalidManualWeaponSlotError} from "./errors/InvalidManualWeaponSlotError.js";
import {IdGenerator} from "./util/IdGenerator.js";
import {Util} from "./util/Util.js";
import {CombatEventDispatcher} from "./CombatEventDispatcher.js";

export class Struct {
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
    this.id = (new IdGenerator()).generate(STRUCT_DEFAULTS.ID_PREFIX);
    this.unitType = unitType;
    this.operatingAmbit = operatingAmbit;
    this.maxHealth = FLEET_STRUCT_DEFAULTS.MAX_HEALTH;
    this.currentHealth = this.maxHealth;
    this.defenders = [];
    this.defending = null;
    this.isDestroyed = false;
    this.canDefend = true;
    this.image = image;
    this.ambitSlot = null;
    this.playerId = '';

    this.manualWeaponPrimary = manualWeaponPrimary;
    this.manualWeaponSecondary = manualWeaponSecondary;
    this.passiveWeapon = passiveWeapon;
    this.defenseComponent = defenseComponent ? defenseComponent : new DefenseComponent();
    this.util = new Util();
    this.combatEventDispatcher = new CombatEventDispatcher();
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
    if (!this.canDefend) {
      throw new DefendActionDisabledError('This struct cannot defend other structs');
    }
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
   * @param {ManualWeapon} attackingWeapon
   * @return {number}
   */
  takeDamage(damage, attacker = null, attackingWeapon = null) {
    const previousHeath = this.currentHealth;
    this.setCurrentHealth(this.currentHealth - this.defenseComponent.reduceAttackDamage(damage, attackingWeapon));
    const damageTaken = previousHeath - this.currentHealth;
    if (this.currentHealth === 0) {
      this.destroyStruct();

      // Counter Attack on Death
      if (this.hasPassiveWeapon() && attacker && !attacker.isDestroyed) {
        const damage = attacker.takeDamage(this.passiveWeapon.getDamageOnDeath());
        if (damage > 0) {
          this.combatEventDispatcher.dispatch(
            EVENTS.COMBAT.COMBAT_COUNTER_ATTACKED_ON_DEATH,
            this,
            attacker,
            damage
          );
        }
      }
    }
    return damageTaken;
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
      && (!this.isCommandStruct() || this.operatingAmbit === struct.operatingAmbit)
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
   * @return {string[]}
   */
  getTargetableAmbits() {
    const targetableAmbits = [];
    if (this.manualWeaponPrimary) {
      targetableAmbits.concat(this.manualWeaponPrimary.ambits);
    }
    if (this.manualWeaponSecondary) {
      targetableAmbits.concat(this.manualWeaponSecondary.ambits);
    }
    return [...new Set(targetableAmbits)];
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
      throw new InvalidManualWeaponSlotError('Invalid weapon slot');
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
      const damage = this.takeDamage(attackingWeapon.getDamage(), attacker);
      this.combatEventDispatcher.dispatch(
        EVENTS.COMBAT.COMBAT_DEFENDER_BLOCKED,
        this,
        attacker,
        damage
      );
      return true;
    }
    return false;
  }

  /**
   * @param {Struct} target
   * @param {boolean} isDefenderCounter
   */
  counterAttack(target, isDefenderCounter = false) {
    if (this.canCounterAttack(target)) {
      const damage = target.takeDamage(
        this.passiveWeapon.getDamageOnCounter(this.operatingAmbit === target.operatingAmbit),
        this
      );
      this.combatEventDispatcher.dispatch(
        isDefenderCounter ? EVENTS.COMBAT.COMBAT_DEFENDER_COUNTERED : EVENTS.COMBAT.COMBAT_COUNTER_ATTACKED,
        this,
        target,
        damage
      );
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

    this.combatEventDispatcher.dispatch(EVENTS.COMBAT.COMBAT_TARGETED, this, target);

    for (let i = 0; i < target.defenders.length; i++) {
      // Defender Block
      if (!attackBlocked) {
        attackBlocked = target.defenders[i].blockAttack(this, attackingWeapon, target);
      }

      // Defender Counter Attack
      if (target.defenders[i]) { // May have been destroyed
        target.defenders[i].counterAttack(this);
      }

      if (this.isDestroyed) {
        this.combatEventDispatcher.dispatch(EVENTS.COMBAT.COMBAT_ENDED, this, target);
        return;
      }
    }

    // Attack
    if (!attackBlocked) {
      const damage = target.takeDamage(attackingWeapon.getDamage(), this, attackingWeapon);
      this.combatEventDispatcher.dispatch(
        EVENTS.COMBAT.COMBAT_ATTACKED,
        this,
        target,
        damage
      );
    }

    // Counter Attack
    target.counterAttack(this);

    this.combatEventDispatcher.dispatch(EVENTS.COMBAT.COMBAT_ENDED, this, target);
  }

  /**
   * @param {string} ambit
   * @return {boolean}
   */
  changeAmbit(ambit) {
    if (this.defenseComponent.canChangeAmbit(this.operatingAmbit, ambit)) {
      this.operatingAmbit = ambit;
      return true;
    }
    return false;
  }

  /**
   * @return {string}
   */
  getUnitTypeLabel() {
    return this.util.titleCase(this.unitType);
  }

  /**
   * @param {number} ambitIndex
   */
  setAmbitSlot(ambitIndex) {
    this.ambitSlot = ambitIndex;
  }

  clearAmbitSlot() {
    this.ambitSlot = null;
  }

  /**
   * @return {number|null}
   */
  getAmbitSlot() {
    return this.ambitSlot;
  }

  /**
   * The ambit slot that is shown in the interface.
   *
   * @return {string}
   */
  getDisplayAmbitSlot() {
    return this.ambitSlot === null ? 'N/A' : `${this.ambitSlot + 1}`;
  }

  /**
   * @return {boolean}
   */
  isCommandStruct() {
    return false;
  }

  /**
   * @return {boolean}
   */
  isHidden() {
    return this.defenseComponent.name === DEFENSE_COMPONENTS.STEALTH_MODE && this.defenseComponent.isActive;
  }
}
