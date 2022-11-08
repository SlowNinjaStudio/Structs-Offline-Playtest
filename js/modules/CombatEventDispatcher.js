import {CombatEvent} from "./CombatEvent.js";

export class CombatEventDispatcher {
  /**
   * @param {string} eventType
   * @param {Struct} sourceStruct
   * @param {Struct} targetStruct
   * @param {number|null} damageAmount
   * @param {string} defenseComponentName
   */
  dispatch(
    eventType,
    sourceStruct,
    targetStruct,
    damageAmount = null,
    defenseComponentName = ''
  ) {
    const event = new CombatEvent(
      eventType,
      sourceStruct,
      targetStruct,
      damageAmount,
      defenseComponentName
    );
    event.dispatch();
  }
}
