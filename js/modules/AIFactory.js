import {AIPlanetMod} from "./AIPlanetMod.js";
import {AI} from "./AI.js";

export class AIFactory {
  /**
   * @param {GameState} state
   * @return {AI}
   */
  make(state) {
    let ai = new AI(state);
    if (state.arePlanetsEnabled) {
      ai = new AIPlanetMod(state);
    }
    return ai;
  }
}
