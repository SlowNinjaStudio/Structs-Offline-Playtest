export class GameState {
  constructor() {
    this.player = null;
    this.enemy = null;

    this.action = null;

    this.gameContainerId = '';
    this.modalContainerId = '';
    this.offcanvasId = '';
  }

  /**
   * @return {Player[]}
   */
  getPlayers() {
    return [this.player, this.enemy];
  }
}
