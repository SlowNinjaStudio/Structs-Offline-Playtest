import {PLAYER_DEFAULTS, UNIT_TYPES} from "./Constants.js";
import {CommandStructBuilder} from "./CommandStructBuilder.js";
import {IdGenerator} from "./IdGenerator.js";
import {Fleet} from "./Fleet.js";

export class Player {
  /**
   * @param {string} name
   */
  constructor(name) {
    this.id = (new IdGenerator()).generate(PLAYER_DEFAULTS.ID_PREFIX);
    this.name = name;
    this.commandStruct = (new CommandStructBuilder()).make(UNIT_TYPES.COMMAND_SHIP);
    this.fleet = new Fleet(this.id);
  }

  /**
   * @return {boolean}
   */
  isDefeated() {
    return this.commandStruct.isDestroyed;
  }
}
