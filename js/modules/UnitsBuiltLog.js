import {UnitsBuiltLogItem} from "./UnitsBuiltLogItem.js";
import {PLAYER_FLEET_TYPES} from "./Constants.js";

export class UnitsBuiltLog {
  constructor() {
    this.log = [];
  }

  /**
   * @param {UnitsBuiltLogItem} item
   */
  logItem(item) {
    this.log.push(item);
  }

  /**
   * @param {Player} player
   * @param {Struct} struct
   * @param {number} turnBuilt
   */
  logStruct(player, struct, turnBuilt) {
    this.logItem(new UnitsBuiltLogItem(player, struct, turnBuilt));
  }

  /**
   * @param {Player} player
   * @param {string} playerFleetType
   * @param {number} turnBuilt
   */
  logFleet(player, playerFleetType, turnBuilt) {
    player[playerFleetType].forEachStruct(function(struct) {
      this.logItem(new UnitsBuiltLogItem(player, struct, turnBuilt));
    }.bind(this));
  }

  /**
   * @param {Player} player
   * @param {number} turnBuilt
   */
  logAllPlayerStructs(player, turnBuilt) {
    this.logItem(new UnitsBuiltLogItem(player, player.commandStruct, turnBuilt));
    if (player.planet) {
      this.logFleet(player, PLAYER_FLEET_TYPES.PLANET, turnBuilt);
    }
    this.logFleet(player, PLAYER_FLEET_TYPES.FLEET, turnBuilt);
  }
}
