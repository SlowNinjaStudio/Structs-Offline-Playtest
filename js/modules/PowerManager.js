export class PowerManager {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    this.state = state;
  }

  managePowerPerRound() {
    const powerGenerationEnabled = this.state.arePlanetsEnabled && this.state.player.planet && this.state.enemy.planet;
    const applyNow = this.state.numTurns > 4 && this.state.numTurns % 2 === 1 && !this.state.gameOverEventDispatched;
    if (powerGenerationEnabled && applyNow) {
      this.state.player.creditManager.addCredits(this.state.player.planet.generatePower());
      this.state.enemy.creditManager.addCredits(this.state.enemy.planet.generatePower());
    }
  }
}
