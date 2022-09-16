export class SlotRef {

  /**
   * @param {string} playerId
   * @param {string} ambit
   * @param {number} ambitSlot
   * @param {boolean} isCommandSlot
   */
  constructor(playerId, ambit, ambitSlot, isCommandSlot) {
    this.playerId = playerId;
    this.ambit = ambit;
    this.ambitSlot = ambitSlot;
    this.isCommandSlot = isCommandSlot;
  }
}
