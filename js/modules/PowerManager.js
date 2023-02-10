import {PLAYER_DEFAULTS} from "./Constants.js";

export class PowerManager {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    this.state = state;
    this.wattCap = PLAYER_DEFAULTS.WATT_CAP;
  }

  /**
   * @param {Player} player
   */
  generate(player) {
    let generated = player.planet.generatePower();
    if (this.wattCap > 0) {
      generated = Math.min(generated, this.wattCap - player.creditManager.credits);
    }
    player.creditManager.addCredits(generated);
  }

  managePowerPerRound() {
    const powerGenerationEnabled = this.state.arePlanetsEnabled && this.state.player.planet && this.state.enemy.planet;
    const applyNow = this.state.numTurns > 4 && this.state.numTurns % 2 === 1 && !this.state.gameOverEventDispatched;
    if (powerGenerationEnabled && applyNow) {
      this.generate(this.state.player);
      this.generate(this.state.enemy);
    }
  }
}
