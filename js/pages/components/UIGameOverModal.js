export class UIGameOverModal {
  /**
   * @param {string} containerId
   * @param {Player} player
   * @param {Player} enemy
   */
  constructor(containerId, player, enemy) {
    this.containerId = containerId;
    this.player = player;
    this.enemy = enemy;
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
    return this.player.isDefeated() || this.enemy.isDefeated();
  }

  /**
   * @return {string}
   */
  render() {
    let playerCSSClass = 'player';
    let playerLabel = 'Player';
    if (this.player.isDefeated()) {
      playerCSSClass = 'enemy';
      playerLabel = 'Enemy';
    }

    return `
      <div class="modal fade ${playerCSSClass}" id="${this.modalId}" tabindex="-1" data-bs-backdrop="static">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Game Over</h5>
            </div>
            <div class="modal-body game-over-msg">
              ${playerLabel} Wins!
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
    if (!this.isGameOver()) {
      return;
    }

    document.getElementById(this.containerId).innerHTML = this.render();

    this.initListeners();

    const domModal = document.getElementById(this.modalId);
    const bsModal = bootstrap.Modal.getOrCreateInstance(domModal);
    bsModal.show();
  }
}
