export class StructRefDTO {
  /**
   * @param {string} playerId
   * @param {string} structId
   * @param {boolean} isCommandStruct
   * @param {boolean} isPlanetaryStruct
   */
  constructor(playerId, structId, isCommandStruct = false, isPlanetaryStruct = false) {
    this.playerId = playerId;
    this.structId = structId;
    this.isCommandStruct = isCommandStruct;
    this.isPlanetaryStruct = isPlanetaryStruct;
  }
}
