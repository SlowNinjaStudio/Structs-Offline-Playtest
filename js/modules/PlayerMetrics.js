export class PlayerMetrics {
  constructor() {
    this.initialStructCount = 0;
    this.primaryAttacks = 0;
    this.secondaryAttacks = 0;
    this.defends = 0;
    this.stealthUses = 0;
    this.structsMoved = 0;
    this.damageTaken = 0;
    this.damageGiven = 0;
    this.kills = 0;
    this.structsLost = 0;
  }

  incrementPrimaryAttacks() {
    this.primaryAttacks++;
  }

  incrementSecondaryAttacks() {
    this.secondaryAttacks++;
  }

  incrementDefends() {
    this.defends++;
  }

  incrementStealthUses() {
    this.stealthUses++;
  }

  incrementStructsMoved() {
    this.structsMoved++;
  }

  /**
   * @param {number} damageAmount
   */
  incrementDamageTaken(damageAmount) {
    this.damageTaken += damageAmount;
  }

  /**
   * @param {number} damageAmount
   */
  incrementDamageGiven(damageAmount) {
    this.damageGiven += damageAmount;
  }

  incrementKills() {
    this.kills++;
  }

  incrementStructsLost() {
    this.structsLost++;
  }
}
