import {FLEET_STRUCT_DEFAULTS} from "./Constants.js";

export class Struct {
  constructor() {
    this.id = this.generateId();
    this.operatingAmbit = null;
    this.targetAmbits = [];
    this.maxHealth = FLEET_STRUCT_DEFAULTS.MAX_HEALTH;
    this.currentHealth = this.maxHealth;
    this.attackDamage = FLEET_STRUCT_DEFAULTS.ATTACK_DAMAGE;
    this.counterAttackDamage = FLEET_STRUCT_DEFAULTS.COUNTER_ATTACK_DAMAGE;
    this.armor = FLEET_STRUCT_DEFAULTS.ARMOR;
    this.defenders = [];
    this.defending = null;
    this.isDestroyed = false;
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
   */
  takeDamage(damage) {
    this.setCurrentHealth(this.currentHealth - Math.max(1, damage - this.armor));
    if (this.currentHealth === 0) {
      this.destroyStruct();
    }
  }

  /**
   * @param {Struct} struct
   * @returns {boolean}
   */
  canAttack(struct) {
    if (this.isDestroyed) {
      throw new Error('A destroyed struct cannot attack');
    }
    if (struct.isDestroyed) {
      throw new Error('A destroyed struct cannot be attacked');
    }
    if (!this.targetAmbits.includes(struct.operatingAmbit)) {
      throw new Error('Cannot target ambit for attack');
    }
  }

  /**
   * @param {Struct} struct
   * @returns {boolean}
   */
  canTakeDamageFor(struct) {
    return this.operatingAmbit === struct.operatingAmbit;
  }

  /**
   * @param {Struct} struct
   */
  attack(struct) {
    let attackBlocked = false;

    this.canAttack(struct);

    for (let i = 0; i < struct.defenders.length; i++) {
      // Defender Blocking
      if (struct.defenders[i].canTakeDamageFor(struct)) {
        struct.defenders[i].takeDamage(this.attackDamage);
        attackBlocked = true;
      }

      // Defender Counter Attack
      if (!struct.defenders[i].isDestroyed) {
        this.takeDamage(this.defenders[i].counterAttackDamage);
      }
    }

    // Attack
    if (!this.isDestroyed && !attackBlocked) {
      struct.takeDamage(this.attackDamage);
    }

    // Counter Attack
    if (!struct.isDestroyed) {
      this.takeDamage(struct.counterAttackDamage);
    }
  }
}
