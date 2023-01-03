import {EVENTS, GAME_MODES, GAME_PHASES} from "../../modules/Constants.js";

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
    this.buttonSaveBudgetId = 'buttonSaveBudgetId';
    this.selectBudgetPlayer1Id = 'selectBudgetPlayer1Id';
    this.selectBudgetPlayer2Id = 'selectBudgetPlayer2Id';
  }

  hide() {
    const bsModal = bootstrap.Modal.getOrCreateInstance(document.getElementById(this.modalId));
    bsModal.hide();
  }

  show() {
    const bsModal = bootstrap.Modal.getOrCreateInstance(document.getElementById(this.modalId));
    bsModal.show();
  }

  init1PlayerListener() {
    const button = document.getElementById(this.button1PlayerId);
    if (button) {
      button.addEventListener('click', function() {
        this.state.gameMode = GAME_MODES.ONE_PLAYER;
        this.state.gamePhase = GAME_PHASES.BUDGET_SELECT;
        this.hide();
        this.init();
      }.bind(this));
    }
  }

  init2PlayersListener() {
    const button = document.getElementById(this.button2PlayerId);
    if (button) {
      button.addEventListener('click', function() {
        this.state.gameMode = GAME_MODES.TWO_PLAYER;
        this.state.gamePhase = GAME_PHASES.BUDGET_SELECT;
        this.hide();
        this.init();
      }.bind(this));
    }
  }

  initSaveBudgetListener() {
    const button = document.getElementById(this.buttonSaveBudgetId);
    if (button) {
      button.addEventListener('click', function() {
        this.state.gamePhase = GAME_PHASES.FLEET_SELECT_P1;
        this.state.player.creditManager.setQualitativeBudget(document.getElementById(this.selectBudgetPlayer1Id).value);
        this.state.player.creditManager.initFromQualitativeBudget();
        this.state.enemy.creditManager.setQualitativeBudget(document.getElementById(this.selectBudgetPlayer2Id).value);
        this.state.enemy.creditManager.initFromQualitativeBudget();

        this.hide();

        window.dispatchEvent(new CustomEvent(EVENTS.RENDER.RENDER_GAME));
      }.bind(this));
    }
  }

  /**
   * @return {string}
   */
  renderAllowGtag() {
    return `
      <div
        id="${this.modalId}"
        class="modal fade allow-gtag"
        tabindex="-1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body">
              <img src="/img/friendly_robot_300x256.png" alt="friendly robot">
              <p>Please allow Google Analytics as we use it to improve the gameplay mechancis.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * @return {string}
   */
  renderPlayerSelectContent() {
    return `
      <div class="modal-body">
        <div id="${this.animationContainer}"></div>
      </div>
      <div class="modal-footer">
        <button id="${this.button1PlayerId}" type="button" class="btn btn-primary">1 Player</button>
        <button id="${this.button2PlayerId}" type="button" class="btn btn-primary">2 Player</button>
      </div>
    `;
  }

  /**
   * @return {string}
   */
  renderBudgetSelectContent() {
    let player2SelectLabel = 'Player 2 Watt Level';
    if (this.state.gameMode === GAME_MODES.ONE_PLAYER) {
      player2SelectLabel = 'CPU Watt Level';
    }

    return `
      <div class="modal-header">
        <div class="w-100 text-center">
          <img src="img/logo-horizontal.png" alt="Structs" class="modal-logo">
        </div>
      </div>
      <div class="modal-body p-4">
        <div class="mb-4">Choose how much Watt each player has. Watt is used to deploy Structs. More advanced Structs cost more Watt.</div>
        <div class="mb-4 fst-italic">If this you first game, we recommend setting both players to "Low."</div>
        <div class="container-fluid p-0">
          <div class="row mb-4 align-items-center">
            <div class="col fw-bold">Player 1 Watt Level</div>
            <div class="col">
              <select id="${this.selectBudgetPlayer1Id}" class="form-select">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="RANDOM">Random</option>
                <option value="CURATED">Curated</option>
              </select>
            </div>
          </div>
          <div class="row mb-4 align-items-center">
            <div class="col fw-bold">${player2SelectLabel}</div>
            <div class="col">
              <select id="${this.selectBudgetPlayer2Id}" class="form-select">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="RANDOM">Random</option>
                <option value="CURATED">Curated</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer border-top-0">
        <button id="${this.buttonSaveBudgetId}" type="button" class="btn btn-primary">Start Game</button>
      </div>
    `;
  }

  /**
   * @return {string}
   */
  renderContent() {
    let content;

    switch(this.state.gamePhase) {
      case GAME_PHASES.BUDGET_SELECT:
        content = this.renderBudgetSelectContent();
        break;
      default:
        content = this.renderPlayerSelectContent();
        break;
    }

    return content;
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
            ${this.renderContent()}
          </div>
        </div>
      </div>
    `;
  }

  init() {
    if (this.state.numTurns === 0 && !window.gtagLoaded) {

      document.getElementById(this.state.modalContainerId).innerHTML = this.renderAllowGtag();
      this.show();

    } else if (this.state.numTurns === 0 && this.state.gamePhase === GAME_PHASES.BUDGET_SELECT) {

      document.getElementById(this.state.modalContainerId).innerHTML = this.render();
      this.initSaveBudgetListener();
      this.show();

    } else if (this.state.numTurns === 0 && !this.state.gamePhase) {

      document.getElementById(this.state.modalContainerId).innerHTML = this.render();

      this.init1PlayerListener();
      this.init2PlayersListener();

      window.lottie.loadAnimation({
        container: document.getElementById(this.animationContainer),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'img/lottie/combat_mechanics_intro/data.json'
      });

      this.show();

    }
  }
}
