import {PlayerMetrics} from "../PlayerMetrics.js";
import {CombatEventLog} from "../CombatEventLog.js";
import {AIThreatTracker} from "../AIThreatTracker.js";

export class GameState {
  constructor() {
    this.gameMode = '';
    this.gamePhase = '';
    this.arePlanetsEnabled = false;

    this.player = null;
    this.enemy = null;

    this.action = null;

    this.turn = null;
    this.numTurns = 0;
    this.turnChangeRequired = false;
    this.gameOverEventDispatched = false;

    this.gameContainerId = '';
    this.modalContainerId = '';
    this.offcanvasId = '';
    this.offcanvasTopId = '';

    this.metrics = {
      player: new PlayerMetrics(),
      enemy: new PlayerMetrics()
    };

    this.combatEventLog = new CombatEventLog();
    this.aiThreatTracker = new AIThreatTracker();
  }

  /**
   * @return {Player[]}
   */
  getPlayers() {
    return [this.player, this.enemy];
  }

  /**
   * @param {string} playerId
   * @return {Player|undefined}
   */
  findPlayerById(playerId) {
    return (this.getPlayers()).find(player => player.id === playerId);
  }
}
