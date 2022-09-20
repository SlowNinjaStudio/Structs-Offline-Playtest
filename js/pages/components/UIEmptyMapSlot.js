import {EVENTS} from "../../modules/Constants.js";

export class UIEmptyMapSlot {

  /**
   * @param {GameState} state
   * @param {Player} player
   * @param {string} ambit
   * @param {number} ambitSlot
   * @param {boolean} isCommandSlot
   */
  constructor(state, player, ambit, ambitSlot, isCommandSlot = false) {
    this.state = state;
    this.player = player;
    this.ambit = ambit;
    this.ambitSlot = ambitSlot;
    this.isCommandSlot = isCommandSlot;
  }

  /**
   * @return {boolean}
   */
  isSelectableSlot() {
    return !this.state.action
      || (
        this.state.action.getType() === EVENTS.ACTIONS.ACTION_MOVE
        && this.state.action.source.playerId === this.player.id
        && this.isCommandSlot
      );
  }

  /**
   * @return {string}
   */
  render() {
    const isSelectable = this.isSelectableSlot();
    return `
      ${isSelectable ? `
      <a
        class="empty-slot ${this.isCommandSlot ? 'command' : 'fleet'}"
        data-player-id="${this.player.id}"
        data-ambit="${this.ambit}"
        data-ambit-slot="${this.ambitSlot}"
        data-is-command-slot="${this.isCommandSlot ? 1 : 0}"
        href="javascript: void(0)"
        role="button"
      >
      ` : ''}
        <div class="struct empty ${isSelectable ? '' : 'unselectable'}"></div>
      ${isSelectable ? `
      </a>
      ` : ''}
    `;
  }
}
