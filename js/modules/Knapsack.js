import {KnapsackLookupDTO} from "./dtos/KnapsackLookupDTO.js";

export class Knapsack {

  /**
   * @param {number} maxIndex
   * @return {KnapsackLookupDTO[]}
   */
  createLookupTable(maxIndex) {
    const lookup = [];
    for (let i = 0; i <= maxIndex; i++) {
      lookup.push(new KnapsackLookupDTO());
    }
    return lookup;
  }

  /**
   * @param {number[]} values
   * @param {number[]} weights
   * @param {number} target
   * @return {KnapsackLookupDTO}
   */
  unbounded(values, weights, target) {
    const lookup = this.createLookupTable(target);

    // lookup[i] is going to store maximum value with knapsack capacity i.
    for (let i = 0; i <= target; i++) {
      for (let j = 0; j < values.length; j++) {
        if (weights[j] <= i && (lookup[i - weights[j]].sum + values[j]) > lookup[i].sum) {
          lookup[i].sum = lookup[i - weights[j]].sum + values[j];
          lookup[i].values = [...lookup[i - weights[j]].values, values[j]];
          lookup[i].weights = [...lookup[i - weights[j]].weights, weights[j]];
        }
      }
    }

    return lookup[target];
  }
}
