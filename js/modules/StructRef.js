export class StructRef {
  /**
   * @param {string} playerId
   * @param {string} structId
   * @param {boolean} isCommandStruct
   */
  constructor(playerId, structId, isCommandStruct = false) {
    this.playerId = playerId;
    this.structId = structId;
    this.isCommandStruct = isCommandStruct;
  }
}
