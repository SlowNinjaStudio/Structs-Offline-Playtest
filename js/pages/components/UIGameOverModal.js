import {EVENTS} from "../../modules/Constants.js";

export class UIGameOverModal {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    this.state = state;
    this.modalId = 'gameOverModal';
    this.playAgainBtnId = 'playAgainBtn';
  }

  initListeners() {
    const playAgainBtn = document.getElementById(this.playAgainBtnId);
    playAgainBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      playAgainBtn.disabled = true;
      location.reload();
    })
  }

  /**
   * @return {boolean}
   */
  isGameOver() {
    return this.state.player.isDefeated() || this.state.enemy.isDefeated();
  }

  /**
   * @return {boolean}
   */
  isOffcanvasClosed() {
    let isClosed = true;
    document.querySelectorAll('.offcanvas').forEach(offcanvas => {
      if (offcanvas.classList.contains('show')) {
        isClosed = false;
      }
    })
    return isClosed;
  }

  /**
   * @return {string}
   */
  render() {
    let playerCSSClass = 'player';
    let playerLabel = 'Player';
    let winner = 'player';
    if (this.state.player.isDefeated()) {
      playerCSSClass = 'enemy';
      playerLabel = 'Enemy';
      winner = 'enemy';
    }

    return `
      <div
        class="modal fade ${playerCSSClass}"
        id="${this.modalId}"
        tabindex="-1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Game Over</h5>
            </div>
            <div class="modal-body text-center">
              <div class="container-fluid game-over-msg">
                <div class="row">
                  <div class="col">
                    ${playerLabel} Wins!
                  </div>
                </div>
              </div>
              <div class="container-fluid my-4 game-over-stats">
                <div class="row">
                  <div class="col">
                    <div class="row">
                      <div class="col-auto text-start fw-bold">
                        <span class="align-middle">Starting Watt</span>
                        <div class="watt-icon"></div>:
                      </div>
                      <div class="col text-end">${this.state.metrics[winner].initialWatt}</div>
                    </div>
                    <div class="row">
                      <div class="col-auto text-start fw-bold">
                        <span class="align-middle">Ending Watt</span>
                        <div class="watt-icon"></div>:
                      </div>
                      <div class="col text-end">${this.state[winner].creditManager.credits}</div>
                    </div>
                    <div class="row">
                      <div class="col-auto text-start fw-bold">Structs Built:</div>
                      <div class="col text-end">${this.state.metrics[winner].structsBuilt}</div>
                    </div>
                    <div class="row">
                      <div class="col-auto text-start fw-bold">Structs Destroyed:</div>
                      <div class="col text-end">${this.state.metrics[winner].kills}</div>
                    </div>
                    <div class="row">
                      <div class="col-auto text-start fw-bold">Structs Lost:</div>
                      <div class="col text-end">${this.state.metrics[winner].structsLost}</div>
                    </div>
                    <div class="row">
                      <div class="col-auto text-start fw-bold">Number of Turns:</div>
                      <div class="col text-end">${this.state.numTurns}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                id="${this.playAgainBtnId}"
                href="javascript: void(0);"
                type="button"
                class="btn btn-dark"
              >Play Again?</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  init() {
    if (!this.isGameOver() || !this.isOffcanvasClosed()) {
      return;
    }

    if (!this.state.gameOverEventDispatched) {
      this.state.gameOverEventDispatched = true;
      window.dispatchEvent(new CustomEvent(EVENTS.GAME_OVER));
    }

    document.getElementById(this.state.modalContainerId).innerHTML = this.render();

    this.initListeners();

    const domModal = document.getElementById(this.modalId);
    const bsModal = bootstrap.Modal.getOrCreateInstance(domModal);
    bsModal.show();
  }
}
