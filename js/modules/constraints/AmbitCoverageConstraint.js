import {AIConstraint} from "./AIConstraint.js";
import {CONSTRAINTS, ORDER_OF_AMBITS} from "../Constants.js";

export class AmbitCoverageConstraint extends AIConstraint {
  /**
   * @param {GameState} state
   */
  constructor(state) {
    super(CONSTRAINTS.AMBIT_COVERAGE, state);
  }

  /**
   * @param {AIAttackParamsDTO} attackParams
   * @return {boolean}
   */
  isSatisfied(attackParams) {
    const ambitAttackCapabilities = this.state.enemy.fleet.analyzeFleetAmbitAttackCapabilities();
    return ambitAttackCapabilities.space > 0
      && ambitAttackCapabilities.sky > 0
      && ambitAttackCapabilities.land > 0
      && ambitAttackCapabilities.water > 0;
  }

  /**
   * @param {Struct} potentialStruct
   * @param {AIAttackParamsDTO} attackParams
   * @return {number}
   */
  couldSatisfy(potentialStruct, attackParams) {
    const ambitAttackCapabilities = this.state.enemy.fleet.analyzeFleetAmbitAttackCapabilities();

    let originalCoverage = 0;
    ORDER_OF_AMBITS.forEach(ambit => {
      originalCoverage += (ambitAttackCapabilities.get(ambit) > 0) ? 1 : 0;
    });

    const targetableAmbits = potentialStruct.getTargetableAmbits();
    targetableAmbits.forEach(ambit => {
      ambitAttackCapabilities.increment(ambit, 1);
    });

    let newCoverage = 0;
    ORDER_OF_AMBITS.forEach(ambit => {
      newCoverage += (ambitAttackCapabilities.get(ambit) > 0) ? 1 : 0;
    });

    return (newCoverage > originalCoverage) ? (newCoverage / ORDER_OF_AMBITS.length) : 0;
  }
}
