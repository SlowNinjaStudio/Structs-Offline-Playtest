import {THREAT} from "./Constants.js";
import {AIThreatDTO} from "./dtos/AIThreatDTO.js";

export class AIThreatTracker {
  constructor() {
    this.threatThreshold = THREAT.DAMAGE_THRESHOLD;
    this.attackingStructs = new Map();
    this.threats = new Map();
  }

  removeDestroyedAttackingStructs() {
    this.attackingStructs.forEach((threat, structId) => {
      if (threat.attackingStruct.isDestroyed) {
        this.attackingStructs.delete(structId);
      }
    });
  }

  removeDestroyedThreats() {
    this.threats.forEach((threat, structId) => {
      if (threat.attackingStruct.isDestroyed) {
        this.threats.delete(structId);
      }
    });
  }

  removeDestroyed() {
    this.removeDestroyedAttackingStructs();
    this.removeDestroyedThreats();
  }

  /**
   * @param {Struct} attackingStruct
   * @param {number} damageAmount
   */
  trackAttack(attackingStruct, damageAmount) {
    let threat;

    if (this.attackingStructs.has(attackingStruct.id)) {
      threat = this.attackingStructs.get(attackingStruct.id);
      threat.cumulativeDamage += damageAmount;
    } else {
      threat = new AIThreatDTO(attackingStruct, damageAmount);
    }

    this.attackingStructs.set(attackingStruct.id, threat);

    if (threat.cumulativeDamage >= this.threatThreshold) {
      this.threats.set(attackingStruct.id, threat);
    }

    this.removeDestroyed();
  }
}
