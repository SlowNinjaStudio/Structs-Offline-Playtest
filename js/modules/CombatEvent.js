export class CombatEvent extends CustomEvent {

  /**
   * @param {string} eventType
   * @param {Struct} sourceStruct
   * @param {Struct} targetStruct
   * @param {number} damageAmount
   */
  constructor(eventType, sourceStruct, targetStruct, damageAmount) {
    super(eventType, {
      detail: {
        sourceStruct: sourceStruct,
        targetPlayer: targetStruct,
        damageAmount: damageAmount
      }
    });
    this.sourceStruct = sourceStruct;
    this.targetPlayer = targetStruct;
    this.damageAmount = damageAmount;
  }

  dispatch() {
    window.dispatchEvent(this);
  }
}
