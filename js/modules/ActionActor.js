export class ActionActor {
  /**
   * @param {StructRefDTO} structRef
   * @param {Player[]} players
   */
  constructor(structRef, players) {
    this.player = players.find(player => player.id === structRef.playerId);
    this.struct = structRef.isCommandStruct
      ? this.player.commandStruct
      : this.player.fleet.findStructById(structRef.structId);
  }
}
