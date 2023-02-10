export class UnitsBuiltLogItem {
  /**
   * @param {Player} player
   * @param {Struct} struct
   * @param {number} turnBuilt
   */
  constructor(player, struct, turnBuilt) {
    this.playerId = player.id;
    this.playerName = player.name;
    this.unitType = struct.unitType;
    this.turnBuilt = turnBuilt;
  }
}
