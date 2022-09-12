import {CombatEvent} from "./CombatEvent.js";

export class CombatEventDispatcher {
  /**
   * @param {string} eventType
   * @param {Struct} sourceStruct
   * @param {Struct} targetStruct
   * @param {number|null} damageAmount
   */
  dispatch(eventType, sourceStruct, targetStruct, damageAmount = null) {
    const event = new CombatEvent(
      eventType,
      sourceStruct,
      targetStruct,
      damageAmount
    );
    event.dispatch();
  }
}
