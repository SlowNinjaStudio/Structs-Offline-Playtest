export class CombatEvent extends CustomEvent {

  /**
   * @param {string} eventType
   * @param {Struct} sourceStruct
   * @param {Struct} targetStruct
   * @param {number|null} damageAmount
   */
  constructor(
    eventType,
    sourceStruct,
    targetStruct,
    damageAmount= null
  ) {
    super(eventType);
    this.sourceStruct = sourceStruct;
    this.targetStruct = targetStruct;
    this.damageAmount = damageAmount;
    this.sourceStructHealth = sourceStruct.currentHealth;
    this.targetStructPreviousHealth = damageAmount !== null ? targetStruct.currentHealth + damageAmount : targetStruct.currentHealth;
    this.targetStructNewHealth = targetStruct.currentHealth;
  }

  dispatch() {
    window.dispatchEvent(this);
  }
}
