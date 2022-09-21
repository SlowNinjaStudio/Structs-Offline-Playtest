import {EVENTS} from "../../modules/Constants.js";

export class UIPrepareDefenses {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    this.state = state;
    this.prepareDefensesEndTurnBtnId = 'prepareDefensesEndTurnBtn';
  }

  initEndTurnListener() {
    const endTurnBtn = document.getElementById(this.prepareDefensesEndTurnBtnId);
    if (endTurnBtn) {
      endTurnBtn.addEventListener('click', function() {
        endTurnBtn.disabled = true;
        window.dispatchEvent(new CustomEvent(EVENTS.TURNS.END_TURN));
        window.dispatchEvent(new CustomEvent(EVENTS.RENDER.RENDER_GAME));
      });
    }
  }

  render() {
    if (this.state.numTurns > 1) {
      return '';
    }

    let playerCSSClass = 'player';
    let playerLabel = 'Player';
    if (this.state.turn.id !== this.state.player.id) {
      playerCSSClass = 'enemy';
      playerLabel = 'Enemy';
    }

    return `
      <div class="cta-card card ${playerCSSClass} text-center mb-4">
        <div class="card-body">
          <h5 class="card-title">Prepare Your Defenses!</h5>
          <p class="card-text">${playerLabel}</p>
          <hr class="mb-3">
          <div class="d-grid gap-2">
            <a id="${this.prepareDefensesEndTurnBtnId}" href="javascript:void(0)" class="btn btn-danger">End Turn</a>
          </div>
        </div>
      </div>
    `;
  };

}
