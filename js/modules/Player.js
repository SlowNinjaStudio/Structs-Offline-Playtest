import {PLAYER_DEFAULTS, UNIT_TYPES} from "./Constants.js";
import {CommandStructBuilder} from "./CommandStructBuilder.js";
import {IdGenerator} from "./util/IdGenerator.js";
import {Fleet} from "./Fleet.js";
import {CreditManager} from "./CreditManager.js";

export class Player {
  /**
   * @param {string} name
   */
  constructor(name) {
    this.id = (new IdGenerator()).generate(PLAYER_DEFAULTS.ID_PREFIX);
    this.name = name;
    const commandShip = (new CommandStructBuilder()).make(UNIT_TYPES.COMMAND_SHIP);
    commandShip.playerId = this.id;
    this.commandStruct = commandShip;
    this.fleet = new Fleet(this.id);
    this.planet = null;
    this.creditManager = new CreditManager();
  }

  /**
   * @return {boolean}
   */
  isDefeated() {
    return this.commandStruct.isDestroyed;
  }

  /**
   * @param {string} structId
   * @param {boolean} isCommandStruct
   * @param {boolean} isPlanetaryStruct
   * @return {Struct}
   */
  getStruct(structId, isCommandStruct = false, isPlanetaryStruct = false) {
    if (isCommandStruct){
      return this.commandStruct;
    } else if (isPlanetaryStruct) {
      return this.planet.findStructById(structId);
    }
    return this.fleet.findStructById(structId);
  }

  /**
   * @return {Struct[]}
   */
  getAllStructs() {
    return [
      this.commandStruct,
      ...(this.planet ? this.planet.toFlatArray(): []),
      ...this.fleet.toFlatArray()
    ].filter(struct => !!struct);
  }

  /**
   * @param {function} callback
   */
  forEachStruct(callback) {
    (this.getAllStructs()).forEach(callback);
  }

  getStructCount() {
    return (this.getAllStructs()).length;
  }
}
