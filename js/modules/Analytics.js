import {GAME_MODES} from "./Constants.js";

export class Analytics {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    this.state = state;
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
    fetch('http://104.37.192.8/game', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "identity_address": "fake", "state": this.finiteState() })
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
