export class ActionActor {
  /**
   * @param {StructRefDTO} structRef
   * @param {Player[]} players
   */
  constructor(structRef, players) {
    this.player = players.find(player => player.id === structRef.playerId);
    this.struct = this.player.getStruct(structRef.structId, structRef.isCommandStruct, structRef.isPlanetaryStruct);
  }
}
