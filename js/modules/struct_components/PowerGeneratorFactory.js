import {PowerGenerator} from "./PowerGenerator.js";
import {POWER_GENERATORS} from "../Constants.js";
import {PowerGeneratorFactoryError} from "../errors/PowerGeneratorFactoryError.js";

export class PowerGeneratorFactory {
  /**
   * @param {string} name
   * @return {PowerGenerator}
   */
  make(name) {
    let generator = null;
    switch(name) {
      case POWER_GENERATORS.GENERIC.NAME:
        generator = this.makeGeneric();
        break;
      default:
        throw new PowerGeneratorFactoryError('Cannot make generator, generator does not exist.');
    }
    return generator;
  }

  /**
   * @return {PowerGenerator}
   */
  makeGeneric() {
    return new PowerGenerator(
      POWER_GENERATORS.GENERIC.NAME,
      POWER_GENERATORS.GENERIC.POWER_OUTPUT
    );
  }
}
