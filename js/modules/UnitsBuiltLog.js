import {UnitsBuiltLogItem} from "./UnitsBuiltLogItem.js";

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
   * @param {number} turnBuilt
   */
  logAllPlayerStructs(player, turnBuilt) {
    player.forEachStruct(function(struct) {
      this.logStruct(player, struct, turnBuilt);
    }.bind(this));
  }
}
