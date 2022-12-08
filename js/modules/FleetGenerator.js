import {Appraiser} from "./Appraiser.js";
import {AmbitsUtil} from "./util/AmbitsUtil.js";
import {AmbitDistribution} from "./AmbitDistribution.js";
import {Knapsack} from "./Knapsack.js";
import {MAX_FLEET_STRUCTS_PER_AMBIT} from "./Constants.js";
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
   */
  generateFleet(fleet, budget) {
    if (fleet.numberOfStructs() !== 0) {
      throw new FleetGeneratorError('FleetGenerator only works with empty fleets.');
    }

    const budgetsByAmbit = this.divideBudget(budget);
    const ambits = this.ambitsUtil.getAmbitsTopFirst();
    let leftoverBudget = budget - budgetsByAmbit.getTotal();

    ambits.forEach(ambit => {
      const target = budgetsByAmbit.get(ambit);
      const values = this.fleetUnitAppraisals.getTacticalValuesForAmbit(ambit);
      const weights = this.fleetUnitAppraisals.getPricesForAmbit(ambit);
      const optimalSpendSuggestion = this.knapsack.unbounded(values, weights, target);

      for (let i = 0; i < optimalSpendSuggestion.weights.length; i++) {
        const price = optimalSpendSuggestion.weights[i];
        const matchingUnits = this.fleetUnitAppraisals[ambit].filter(unitAppraisal =>
          unitAppraisal.price === price
        );
        const selectedUnit = matchingUnits[Math.floor(Math.random() * matchingUnits.length)];

        fleet.addStruct(this.structBuilder.make(selectedUnit.unitType));
      }

      leftoverBudget += target - optimalSpendSuggestion.sum;
    });
  }
}
