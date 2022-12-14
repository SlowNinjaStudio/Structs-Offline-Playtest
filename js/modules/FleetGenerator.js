import {Appraiser} from "./Appraiser.js";
import {AmbitsUtil} from "./util/AmbitsUtil.js";
import {AmbitDistribution} from "./AmbitDistribution.js";
import {Knapsack} from "./Knapsack.js";
import {MAX_FLEET_STRUCTS_PER_AMBIT, UNIT_TYPES} from "./Constants.js";
import {FleetGeneratorError} from "./errors/FleetGeneratorError.js";
import {StructBuilder} from "./StructBuilder.js";

export class FleetGenerator {
  constructor() {
    this.appraiser = new Appraiser();
    this.ambitsUtil = new AmbitsUtil();
    this.knapsack = new Knapsack();
    this.fleetUnitAppraisals = this.appraiser.getAllFleetUnitAppraisals();
    this.structBuilder = new StructBuilder();
  }

  /**
   * @param {number} budget
   * @return {AmbitDistribution}
   */
  divideBudget(budget) {
    const budgetsByAmbit = new AmbitDistribution();
    const ambits = this.ambitsUtil.getAmbitsTopFirst();
    const budgetShareForAmbit = Math.max(Math.floor(budget / ambits.length), 0);

    ambits.forEach(ambit => {
      const mostExpensiveUnit = this.fleetUnitAppraisals.getMostExpensiveForAmbit(ambit);
      const maxBudgetForAmbit = mostExpensiveUnit.price * MAX_FLEET_STRUCTS_PER_AMBIT[ambit];

      budgetsByAmbit.set(ambit, Math.min(budgetShareForAmbit, maxBudgetForAmbit));
    })

    return budgetsByAmbit;
  }


  /**
   * @param {Fleet} fleet
   * @param {number} budget
   * @return {number} amount spent generating fleet
   */
  generateFleet(fleet, budget) {
    if (fleet.numberOfStructs() !== 0) {
      throw new FleetGeneratorError('FleetGenerator only works with empty fleets.');
    }

    const budgetsByAmbit = this.divideBudget(budget);
    const ambits = this.ambitsUtil.getAmbitsTopFirst();
    let totalSpend = 0;

    ambits.forEach(ambit => {
      const target = budgetsByAmbit.get(ambit);
      const values = this.fleetUnitAppraisals.getTacticalValuesForAmbit(ambit);
      const weights = this.fleetUnitAppraisals.getPricesForAmbit(ambit);
      const optimalSpendSuggestion = this.knapsack.bruteForce(
        values,
        weights,
        target,
        MAX_FLEET_STRUCTS_PER_AMBIT[ambit]
      );

      for (let i = 0; i < optimalSpendSuggestion.weights.length; i++) {
        const price = optimalSpendSuggestion.weights[i];
        const matchingUnits = this.fleetUnitAppraisals[ambit].filter(unitAppraisal =>
          unitAppraisal.price === price
        );
        const selectedUnit = matchingUnits[Math.floor(Math.random() * matchingUnits.length)];
        if (selectedUnit) {
          fleet.addStruct(this.structBuilder.make(selectedUnit.unitType));
          totalSpend += this.appraiser.calcUnitTypePrice(selectedUnit.unitType);
        }
      }
    });

    return totalSpend;
  }

  /**
   * @param {Fleet} fleet
   */
  generateCuratedFleet(fleet) {
    fleet.reset();
    fleet.addStruct(this.structBuilder.make(UNIT_TYPES.STAR_FIGHTER));
    fleet.addStruct(this.structBuilder.make(UNIT_TYPES.SPACE_FRIGATE));
    fleet.addStruct(this.structBuilder.make(UNIT_TYPES.GALACTIC_BATTLESHIP));
    fleet.addStruct(this.structBuilder.make(UNIT_TYPES.STAR_FIGHTER));
    fleet.addStruct(this.structBuilder.make(UNIT_TYPES.FIGHTER_JET));
    fleet.addStruct(this.structBuilder.make(UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR));
    fleet.addStruct(this.structBuilder.make(UNIT_TYPES.STEALTH_BOMBER));
    fleet.addStruct(this.structBuilder.make(UNIT_TYPES.FIGHTER_JET));
    fleet.addStruct(this.structBuilder.make(UNIT_TYPES.TANK));
    fleet.addStruct(this.structBuilder.make(UNIT_TYPES.ARTILLERY));
    fleet.addStruct(this.structBuilder.make(UNIT_TYPES.SAM_LAUNCHER));
    fleet.addStruct(this.structBuilder.make(UNIT_TYPES.TANK));
    fleet.addStruct(this.structBuilder.make(UNIT_TYPES.SUB));
    fleet.addStruct(this.structBuilder.make(UNIT_TYPES.DESTROYER));
    fleet.addStruct(this.structBuilder.make(UNIT_TYPES.CRUISER));
    fleet.addStruct(this.structBuilder.make(UNIT_TYPES.SUB));
  }
}
