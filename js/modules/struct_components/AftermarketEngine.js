import {DefenseComponent} from "./DefenseComponent.js";
import {DEFENSE_COMPONENT_TYPES, ORDER_OF_AMBITS} from "../Constants.js";

export class AftermarketEngine extends DefenseComponent {
  /**
   * @param {string} name
   * @param {string[]} operatingAmbits
   * @param {number|null} maxTravelDistance
   */
  constructor(name, operatingAmbits, maxTravelDistance = ORDER_OF_AMBITS.length) {
    super(DEFENSE_COMPONENT_TYPES.AFTERMARKET_ENGINE, name, true);
    this.operatingAmbits = operatingAmbits;
    this.maxTravelDistance = maxTravelDistance;
  }

  /**
   * @param {string} currentAmbit
   * @param {string} desiredAmbit
   * @return {boolean}
   */
  canChangeAmbit(currentAmbit, desiredAmbit) {
    if (!this.operatingAmbits.includes(desiredAmbit)) {
      return false;
    }

    const currentAmbitPosition = ORDER_OF_AMBITS.indexOf(currentAmbit);
    const desiredAmbitPosition = ORDER_OF_AMBITS.indexOf(desiredAmbit);
    return Math.abs(currentAmbitPosition - desiredAmbitPosition) <= this.maxTravelDistance;
  }
}
