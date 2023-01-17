import {MAX_PLANETARY_STRUCTS_PER_AMBIT, PLAYER_DEFAULTS} from "./Constants.js";
import {Fleet} from "./Fleet.js";

export class Planet extends Fleet {
  /**
   * @param {string} playerId
   * @param {number} maxStructs
   * @param {Object} maxStructsPerAmbit
   */
  constructor(
    playerId = '',
    maxStructs = PLAYER_DEFAULTS.MAX_ACTIVE_PLANETARY_STRUCTS,
    maxStructsPerAmbit = MAX_PLANETARY_STRUCTS_PER_AMBIT
  ) {
    super(playerId, maxStructs, maxStructsPerAmbit);
  }
}
