import {ANALYTICS_DEFAULTS, GAME_MODES} from "./Constants.js";
import {IdGenerator} from "./util/IdGenerator.js";

export class Analytics {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    this.state = state;

    this.identity = localStorage.getItem(ANALYTICS_DEFAULTS.IDENTITY_COOKIE);
    if ((this.identity === null) || (typeof this.identity === 'undefined')) {
      this.identity = new IdGenerator().generate(ANALYTICS_DEFAULTS.IDENTITY_PREFIX);
      localStorage.setItem(ANALYTICS_DEFAULTS.IDENTITY_COOKIE, this.identity);
    }

  }

  trackGameStart() {
    gtag("event", "level_start", {
      level_name: this.state.gameMode
    });
  }

  trackDefensePhaseEnd() {
    gtag("event", "tutorial_complete", {
      level_name: this.state.gameMode,
      player_defends: this.state.metrics.player.defends,
      enemy_defends: this.state.metrics.enemy.defends,
    });
  }

  trackEarlyExit() {
    if (!this.state.gameOverEventDispatched) {
      this.submitGameStateToCustom();
      gtag("event", "level_end", {
        level_name: this.state.gameMode,
        success: false
      });
    }
  }

  /**
   * @param {Player} winningPlayer
   */
  trackPlayerDefeatsAI(winningPlayer) {
    if (this.state.gameMode === GAME_MODES.ONE_PLAYER && winningPlayer.id === this.state.player.id) {
      gtag("event", "unlock_achievement", {
        achievement_id: 'PLAYER_DEFEATED_AI',
      });
    }
  }

  /**
   * @param {Player} winningPlayer
   */
  trackAIDefeatsPlayer(winningPlayer) {
    if (this.state.gameMode === GAME_MODES.ONE_PLAYER && winningPlayer.id === this.state.enemy.id) {
      gtag("event", "level_up");
    }
  }

  /**
   * @param {Player} winningPlayer
   */
  trackTwoPlayerGameEnded(winningPlayer) {
    if (this.state.gameMode === GAME_MODES.TWO_PLAYER) {
      const winnerName = winningPlayer.name.toUpperCase();
      gtag("event", "post_score", {
        score: 1,
        character: winnerName
      });
    }
  }

  /**
   * @param {Player} winningPlayer
   */
  trackGameOver(winningPlayer) {

    this.submitGameStateToCustom();

    this.trackTwoPlayerGameEnded(winningPlayer);
    this.trackPlayerDefeatsAI(winningPlayer);
    this.trackAIDefeatsPlayer(winningPlayer);
  }

  submitGameStateToCustom() {
    fetch(ANALYTICS_DEFAULTS.SERVER + '/' + ANALYTICS_DEFAULTS.ENDPOINT , {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "identity": this.identity, "state": this.finiteState() })
    }).then(response => console.log('Game Submission Received'))
  }

  finiteState(){
    return {
      "gameMode": this.state.gameMode,
      "numTurns": this.state.numTurns,
      "gameCompleted": this.state.gameOverEventDispatched,
      "combatEventLog" : {
        "log": this.state.combatEventLog.log
      }
    }
  }
}
