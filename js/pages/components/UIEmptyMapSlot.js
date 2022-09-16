export class UIEmptyMapSlot {

  /**
   * @param {Player} player
   * @param {string} ambit
   * @param {number} ambitSlot
   * @param {boolean} isCommandSlot
   */
  constructor(player, ambit, ambitSlot, isCommandSlot = false) {
    this.player = player;
    this.ambit = ambit;
    this.ambitSlot = ambitSlot;
    this.isCommandSlot = isCommandSlot;
  }

  /**
   * @return {string}
   */
  render() {
    return `
      <a
        class="empty-slot ${this.isCommandSlot ? 'command' : 'fleet'}"
        data-player-id="${this.player.id}"
        data-ambit="${this.ambit}"
        data-ambit-slot="${this.ambitSlot}"
        data-is-command-slot="${this.isCommandSlot ? 1 : 0}"
        href="javascript: void(0)"
        role="button"
      >
        <div class="struct empty"></div>
      </a>
    `;
  }
}
