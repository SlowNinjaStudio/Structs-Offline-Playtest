import {EVENTS, GAME_MODES} from "../../modules/Constants.js";
import {Analytics} from "../../modules/Analytics.js";

export class UIGameStartModal {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    this.state = state;
    this.modalId = 'gameStartModal';
    this.animationContainer = 'animationContainer';
    this.button1PlayerId = 'button1Player';
    this.button2PlayerId = 'button2Player';

    this.analytics = new Analytics(state);
  }

  init2PlayersListener() {
    document.getElementById(this.button2PlayerId).addEventListener('click', function() {
      this.state.gameMode = GAME_MODES.TWO_PLAYER;
      this.analytics.trackGameStart();
      const bsModal = bootstrap.Modal.getOrCreateInstance(document.getElementById(this.modalId));
      bsModal.hide();
      window.dispatchEvent(new CustomEvent(EVENTS.TURNS.FIRST_TURN));
    }.bind(this));
  }

  render() {
    return `
      <div
        id="${this.modalId}"
        class="modal fade"
        tabindex="-1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body">
              <div id="${this.animationContainer}"></div>
            </div>
            <div class="modal-footer">
              <button id="${this.button1PlayerId}" type="button" class="btn btn-secondary" disabled>1 Player</button>
              <button id="${this.button2PlayerId}" type="button" class="btn btn-primary">2 Player</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  init() {
    if (this.state.numTurns === 0) {
      document.getElementById(this.state.modalContainerId).innerHTML = this.render();
      this.init2PlayersListener();
      const domModal = document.getElementById(this.modalId);
      const bsModal = bootstrap.Modal.getOrCreateInstance(domModal);

      window.lottie.loadAnimation({
        container: document.getElementById(this.animationContainer),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'img/lottie/combat_mechanics_intro/data.json'
      });

      bsModal.show();
    }
  }
}
