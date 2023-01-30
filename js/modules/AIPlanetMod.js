import {AI} from "./AI.js";
import {AMBITS, ORDER_OF_AMBITS, UNIT_TYPES} from "./Constants.js";
import {StructBuilder} from "./StructBuilder.js";

export class AIPlanetMod extends AI {

  /**
   * @param {GameState} state
   */
  constructor(state) {
    super(state);
    this.structBuilder = new StructBuilder();
  }

  /**
   * @param {string} unitType
   * @param {string} ambit
   * @return {number}
   */
  countUnitType(unitType, ambit) {
    return this.state.enemy.fleet[ambit.toLowerCase()].reduce((count, struct) =>
        count + (struct && (struct.unitType === unitType) ? 1 : 0)
    , 0);
  }

  placeGenerator() {
    const numTanks = this.countUnitType(UNIT_TYPES.TANK, AMBITS.LAND);
    const numFighterJets = this.countUnitType(UNIT_TYPES.FIGHTER_JET, AMBITS.SKY);
    const generator = this.structBuilder.make(UNIT_TYPES.GENERATOR);
    generator.operatingAmbit = numFighterJets > numTanks ? AMBITS.SKY : AMBITS.LAND;
    this.state.enemy.planet.addStruct(generator);
  }

  /**
   * @param {Planet} planet
   * @return {Struct|null}
   */
  findGenerator(planet) {
    let generator = null;
    planet.forEachStruct(struct => {
      if (struct.unitType === UNIT_TYPES.GENERATOR) {
        generator = struct;
      }
    });
    return generator;
  }

  /**
   * @return {Struct}
   */
  getAttackGoal() {
    if (this.state.arePlanetsEnabled) {
      const generator = this.findGenerator(this.state.player.planet);
      if (generator && !generator.isDestroyed && this.state.player.commandStruct.defenders.length > 0) {
        return generator;
      }
    }
    return this.state.player.commandStruct;
  }

  openingDefense() {
    const vipStructs = {
      commandStruct: this.state.enemy.commandStruct,
      generator: this.findGenerator(this.state.enemy.planet)
    };
    let assignTo = 'commandStruct';
    this.state.enemy.fleet.forEachStruct(aiStruct => {
      if (aiStruct.operatingAmbit === vipStructs.commandStruct.operatingAmbit) {
        aiStruct.defend(vipStructs.commandStruct);
      } else if (
        vipStructs.generator
        && !vipStructs.generator.isDestroyed
        && aiStruct.operatingAmbit === vipStructs.generator.operatingAmbit
      ) {
        aiStruct.defend(vipStructs.generator);
      } else {
        aiStruct.defend(vipStructs[assignTo]);
        assignTo = (assignTo === 'commandStruct') ? 'generator' : 'commandStruct';
      }
    });
  }

  /**
   * Find the ambit where the fleet has the most structs. If the most occupied ambit contains the Generator,
   * use the second most occupied ambit unless it's empty.
   *
   * @param {Player} player
   * @return {string|null}
   */
  findAmbitForBestDefense(player) {
    let mostOccupiedAmbit = null;
    let mostStructs = 0;
    let secondMostOccupiedAmbit = null;
    let secondMostStructs = 0;
    const generator = this.findGenerator(player.planet);
    const ambitPositions = this.analyzeFleetAmbitPositions(player.fleet);
    const ambits = ORDER_OF_AMBITS;
    for (let i = 0; i < ambits.length; i++) {
      if (ambitPositions[ambits[i].toLowerCase()] > mostStructs) {
        secondMostOccupiedAmbit = mostOccupiedAmbit;
        secondMostStructs = mostStructs;
        mostStructs = ambitPositions[ambits[i].toLowerCase()];
        mostOccupiedAmbit = ambits[i];
      }
    }
    return (
      generator
      && !generator.isDestroyed
      && generator.operatingAmbit === `${mostOccupiedAmbit}`
      && secondMostStructs > 0
    ) ? secondMostOccupiedAmbit : mostOccupiedAmbit;
  }

  defendVIPStructsWithUnused() {
    const generator = this.findGenerator(this.state.enemy.planet);
    const isGeneratorAvailable = generator && !generator.isDestroyed;
    let numDefendersCommandStruct = this.state.enemy.commandStruct.defenders.length;
    let numDefendersGenerator = isGeneratorAvailable ? generator.defenders.length : Infinity;

    this.state.enemy.fleet.forEachStruct(struct => {
      if (!struct.isDestroyed && !struct.defending) {
        if (numDefendersCommandStruct <= numDefendersGenerator) {
          struct.defend(this.state.enemy.commandStruct);
          numDefendersCommandStruct++;
        } else {
          struct.defend(generator);
          numDefendersGenerator++;
        }
      }
    });
  }

  /**
   * @param {Struct} struct
   * @return {number}
   */
  countBlockingDefenders(struct) {
    return this.state.enemy.commandStruct.defenders.reduce((count, struct) =>
      count + ((struct.operatingAmbit === this.state.enemy.commandStruct.operatingAmbit) ? 1 : 0)
    , 0)
  }

  /**
   * @param {string} ambit
   * @return {Struct|undefined}
   */
  findLowValueDefender(ambit) {
    return this.state.enemy.fleet[ambit.toLowerCase()].find(struct =>
      struct
      && !struct.isDestroyed
      && struct.defending
      && !struct.defending.isCommandStruct
      && !struct.defending.isPlanetaryStruct
    );
  }

  /**
   * @param {string} ambit
   * @param {boolean} forCommandStruct
   * @return {Struct|undefined}
   */
  findExtraDefender(ambit, forCommandStruct = false) {
    return this.state.enemy.fleet[ambit.toLowerCase()].find(struct =>
      struct
      && !struct.isDestroyed
      && struct.defending
      && (forCommandStruct || struct.defending.defenders.length >= 2)
    );
  }

  /**
   * Try finding a struct that's only defending another regular fleet struct first,
   * if there are none, try finding a struct that defending a planetary struct.
   * @param {string} ambit
   * @param {boolean} forCommandStruct
   * @return {Struct|undefined}
   */
  findStealableDefender(ambit, forCommandStruct = false) {
    let defender = this.findLowValueDefender(ambit);
    if (!defender) {
      defender = this.findExtraDefender(ambit, forCommandStruct);
    }
    return defender;
  }

  /**
   * @param {Struct} struct
   */
  reviewBlockingDefenders(struct) {
    if (this.countBlockingDefenders(struct) > 0) {
      return;
    }
    const potentialDefender = this.findStealableDefender(struct.operatingAmbit.toLowerCase(), struct.isCommandStruct());
    if (potentialDefender) {
      potentialDefender.defend(struct);
    }
  }

  reviewCommandShipBlockingDefenders() {
    this.reviewBlockingDefenders(this.state.enemy.commandStruct);
  }

  reviewGeneratorBlockingDefenders() {
    const generator = this.findGenerator(this.state.enemy.planet);
    if (generator || !generator.isDestroyed) {
      this.reviewBlockingDefenders(generator);
    }
  }

  turnBasedDefense() {
    this.moveCommandStructToMostDefensibleAmbit();
    this.defendLastAttackedStruct();
    this.defendVIPStructsWithUnused();
    this.reviewCommandShipBlockingDefenders();
    this.reviewGeneratorBlockingDefenders();
  }
}
