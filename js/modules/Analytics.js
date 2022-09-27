import {GAME_MODES, TRACKING} from "./Constants.js";

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

  /**
   * @param {string} winner
   * @param {boolean} success
   */
  gaTrackLevelEnd(winner, success) {
    gtag("event", "level_end", {
      level_name: this.state.gameMode,
      success: success,
      winner: winner,

      player_initial_struct_count: this.state.metrics.player.initialStructCount,
      player_primary_attacks: this.state.metrics.player.primaryAttacks,
      player_secondary_attacks: this.state.metrics.player.secondaryAttacks,
      player_defends: this.state.metrics.player.defends,
      player_stealth_uses: this.state.metrics.player.stealthUses,
      player_structs_moved: this.state.metrics.player.structsMoved,
      player_damage_taken: this.state.metrics.player.damageTaken,
      player_damage_given: this.state.metrics.player.damageGiven,
      player_kills: this.state.metrics.player.kills,
      player_structs_lost: this.state.metrics.player.structsLost,

      enemy_initial_struct_count: this.state.metrics.enemy.initialStructCount,
      enemy_primary_attacks: this.state.metrics.enemy.primaryAttacks,
      enemy_secondary_attacks: this.state.metrics.enemy.secondaryAttacks,
      enemy_defends: this.state.metrics.enemy.defends,
      enemy_stealth_uses: this.state.metrics.enemy.stealthUses,
      enemy_structs_moved: this.state.metrics.enemy.structsMoved,
      enemy_damage_taken: this.state.metrics.enemy.damageTaken,
      enemy_damage_given: this.state.metrics.enemy.damageGiven,
      enemy_kills: this.state.metrics.enemy.kills,
      enemy_structs_lost: this.state.metrics.enemy.structsLost
    });
  }

  /**
   * @param {Player} winningPlayer
   */
  trackGameOver(winningPlayer) {
    const winnerName = winningPlayer.name.toUpperCase();
    const success = this.state.gameMode === GAME_MODES.TWO_PLAYER
      || (this.state.gameMode === GAME_MODES.ONE_PLAYER && winningPlayer.id === this.state.player.id);
    this.gaTrackLevelEnd(winnerName, success);
  }

  trackEarlyExit() {
    this.gaTrackLevelEnd(TRACKING.DNF, false);
  }
}
