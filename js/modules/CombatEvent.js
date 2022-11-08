export class CombatEvent extends CustomEvent {

  /**
   * @param {string} eventType
   * @param {Struct} sourceStruct
   * @param {Struct} targetStruct
   * @param {number|null} damageAmount
   * @param {string} defenseComponentName
   */
  constructor(
    eventType,
    sourceStruct,
    targetStruct,
    damageAmount = null,
    defenseComponentName = ''
  ) {
    super(eventType);
    this.sourceStruct = sourceStruct;
    this.targetStruct = targetStruct;
    this.damageAmount = damageAmount;
    this.sourceStructHealth = sourceStruct.currentHealth;
    this.targetStructPreviousHealth = damageAmount !== null ? targetStruct.currentHealth + damageAmount : targetStruct.currentHealth;
    this.targetStructNewHealth = targetStruct.currentHealth;
    this.defenseComponentName = defenseComponentName;
  }

  dispatch() {
    window.dispatchEvent(this);
  }
}
