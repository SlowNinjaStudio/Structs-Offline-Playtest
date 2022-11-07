import {EVENTS} from "./Constants.js";

export class StructAction {
  /**
   * @param {string} type
   * @param {StructRefDTO} source
   */
  constructor(type, source) {
    this.setType(type);
    this.source = source;
    this.data = {};
    this.applicableStructsFilter = () => true;
  }

  /**
   * @param {string} type
   */
  setType(type) {
    if (!EVENTS.ACTIONS[type]) {
      throw new Error(`Invalid struct action type: ${type}`);
    }
    this.type = type;
  }

  /**
   * @return {string}
   */
  getType() {
    return this.type;
  }

  dispatchEvent() {
    window.dispatchEvent(new CustomEvent(
      this.type,
      {
        detail: {
          source: this.source,
          data: this.data
        },
      }
    ));
  }
}
