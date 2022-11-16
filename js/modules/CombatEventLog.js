import {EVENTS} from "./Constants.js";

export class CombatEventLog {
  constructor() {
    this.log = [];
  }

  /**
   * @param {CombatEventLogItem} item
   */
  logItem(item) {
    this.log.push(item);
  }

  /**
   * @param {Player} player
   * @return {CombatEventLogItem|undefined}
   */
  findLastAttackByPlayer(player) {
    for (let i = this.log.length - 1; i >= 0; i--) {
      if (this.log[i].sourcePlayerId === player.id && this.log[i].eventType === EVENTS.COMBAT.COMBAT_ATTACKED) {
        return this.log[i];
      }
    }
    return undefined;
  }
}
