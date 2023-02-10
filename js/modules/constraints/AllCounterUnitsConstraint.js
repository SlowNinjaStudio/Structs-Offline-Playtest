import {AIConstraint} from "./AIConstraint.js";
import {CONSTRAINTS} from "../Constants.js";

export class AllCounterUnitsConstraint extends AIConstraint {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    super(CONSTRAINTS.ALL_COUNTER_UNITS, state);
  }

  /**
   * @param {AIAttackParamsDTO} attackParams
   * @return {boolean}
   */
  isSatisfied(attackParams) {
    const playerFleetArray = this.state.player.fleet.toFlatArray();
    const enemyFleetArray = this.state.enemy.fleet.toFlatArray();
    return playerFleetArray.reduce((satisfied, playerStruct) =>
      satisfied && !!enemyFleetArray.find(enemyStruct =>
        enemyStruct.isCounterUnitTo(playerStruct) && enemyStruct.canDefeatStructsCounterMeasure(playerStruct)
      )
    , true);
  }

  /**
   * @param {Fleet} targetFleet
   * @param {Struct} attackingUnit
   * @return {Struct[]}
   */
  findAllCounterableUnits(targetFleet, attackingUnit) {
    const canCounter = [];
    const targetFleetArray = targetFleet.toFlatArray();
    targetFleetArray.forEach(playerStruct => {
      if (attackingUnit.isCounterUnitTo(playerStruct) && attackingUnit.canDefeatStructsCounterMeasure(playerStruct)) {
        canCounter.push(playerStruct);
      }
    });
    return canCounter;
  }

  /**
   * @param {Struct[]} targetStructs
   * @param {Fleet} oppositionFleet
   * @return {boolean}
   */
  haveCountersInFleet(targetStructs, oppositionFleet) {
    const oppositionFleetArray = oppositionFleet.toFlatArray();
    return targetStructs.reduce((allCountered, targetStruct) =>
      allCountered && !!oppositionFleetArray.find(oppositionStruct =>
        oppositionStruct.isCounterUnitTo(targetStruct) && oppositionStruct.canDefeatStructsCounterMeasure(targetStruct)
      )
    , true);
  }

  /**
   * @param {Struct} potentialStruct
   * @param {AIAttackParamsDTO} attackParams
   * @return {number}
   */
  couldSatisfy(potentialStruct, attackParams) {
    const canCounter = this.findAllCounterableUnits(this.state.player.fleet, potentialStruct);
    const allCountered = this.haveCountersInFleet(canCounter, this.state.enemy.fleet);

    if (canCounter.length > 0 && !allCountered) {
      return 1;
    }

    return 0;
  }
}
