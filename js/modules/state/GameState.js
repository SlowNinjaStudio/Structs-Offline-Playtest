import {PlayerMetrics} from "../PlayerMetrics.js";

export class GameState {
  constructor() {
    this.gameMode = '';

    this.player = null;
    this.enemy = null;

    this.action = null;

    this.turn = null;
    this.numTurns = 0;
    this.turnChangeRequired = false;

    this.gameContainerId = '';
    this.modalContainerId = '';
    this.offcanvasId = '';

    this.metrics = {
      player: new PlayerMetrics(),
      enemy: new PlayerMetrics()
    };
  }

  /**
   * @return {Player[]}
   */
  getPlayers() {
    return [this.player, this.enemy];
  }
}
