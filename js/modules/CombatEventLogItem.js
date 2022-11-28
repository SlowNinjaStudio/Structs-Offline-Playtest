export class CombatEventLogItem {
  /**
   * @param {CombatEvent} combatEvent
   * @param {Player} player
   * @param {Player} enemy
   */
  constructor(combatEvent, player, enemy) {
    this.eventType = combatEvent.type;

    this.sourcePlayerId = combatEvent.sourceStruct.playerId;
    this.sourcePlayerName = (combatEvent.sourceStruct.playerId === player.id) ? player.name : enemy.name;
    this.sourceStructId = combatEvent.sourceStruct.id;
    this.sourceOperatingAmbit = combatEvent.sourceStruct.operatingAmbit;
    this.sourceDisplayAmbitSlot = combatEvent.sourceStruct.getDisplayAmbitSlot();
    this.sourceUnitType = combatEvent.sourceStruct.unitType;
    this.sourceImage = combatEvent.sourceStruct.image;

    this.targetPlayerId = combatEvent.targetStruct.playerId;
    this.targetPlayerName = (combatEvent.targetStruct.playerId === player.id) ? player.name : enemy.name;
    this.targetStructId = combatEvent.targetStruct.id;
    this.targetOperatingAmbit = combatEvent.targetStruct.operatingAmbit;
    this.targetSlot = combatEvent.targetStruct.getDisplayAmbitSlot();
    this.targetUnitType = combatEvent.targetStruct.unitType;
    this.targetImage = combatEvent.targetStruct.image;
    this.targetPreviousHealth = combatEvent.targetStructPreviousHealth;
    this.targetNewHealth = combatEvent.targetStructNewHealth;
    this.targetDefenseComponentName = combatEvent.defenseComponentName;
  }
}
