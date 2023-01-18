import {PowerGeneratorFactory} from "./struct_components/PowerGeneratorFactory.js";
import {AMBITS, IMG, POWER_GENERATORS, UNIT_TYPES} from "./Constants.js";
import {PlanetaryStruct} from "./PlanetaryStruct.js";
import {PlanetaryStructBuilderError} from "./errors/PlanetaryStructBuilderError.js";

export class PlanetaryStructBuilder {
  constructor() {
    this.powerGeneratorFactory = new PowerGeneratorFactory();
  }

  /**
   * @param {string} unitType
   * @return {Struct}
   */
  make(unitType) {
    let struct = null;
    switch(unitType) {
      case UNIT_TYPES.GENERATOR:
        struct = this.makeGenerator();
        break;
      default:
        throw new PlanetaryStructBuilderError('Unknown planetary struct type.');
    }
    return struct;
  }

  /**
   * @return {PlanetaryStruct}
   */
  makeGenerator() {
    return new PlanetaryStruct(
      UNIT_TYPES.GENERATOR,
      AMBITS.LAND,
      null,
      null,
      null,
      null,
      this.powerGeneratorFactory.make(POWER_GENERATORS.GENERIC.NAME),
      IMG.STRUCTS + 'generator.jpg'
    );
  }
}
