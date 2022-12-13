import {KnapsackLookupDTO} from "./dtos/KnapsackLookupDTO.js";
import {ArrayUtil} from "./util/ArrayUtil.js";

export class Knapsack {

  constructor() {
    this.arrayUtil = new ArrayUtil();
  }

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

  bruteForce(values, weights, target, maxItems) {
    let knapsack = new Array(maxItems).fill(0);
    let bestValueCombo = new Array(maxItems).fill(0);
    let bestWeightCombo = new Array(maxItems).fill(0);

    for (let i = 0; i < knapsack.length; i++) {
      for (let m = 0; m < Math.pow(values.length, i); m++) {
        for (let j = 1; j <= values.length; j++) {
          knapsack[i] = j;
          const knapsackValues = knapsack.map(valueIndex => valueIndex > 0 ? values[valueIndex - 1] : 0);
          const knapsackWeights = knapsack.map(valueIndex => valueIndex > 0 ? weights[valueIndex - 1] : 0);
          const valueSum = this.arrayUtil.sum(knapsackValues);
          const weightsSum = this.arrayUtil.sum(knapsackWeights);

          if (valueSum > this.arrayUtil.sum(bestValueCombo) && weightsSum <= target) {
            bestValueCombo = [...knapsackValues];
            bestWeightCombo = [...knapsackWeights];
          }
        }
        knapsack[i] = 1;
        let k = 1;
        while (i - k >= 0) {
          knapsack[i - k]++;
          if (knapsack[i - k] > values.length) {
            knapsack[i - k] = 1;
            k++;
          } else {
            break;
          }
        }
      }
    }

    return new KnapsackLookupDTO(
      this.arrayUtil.sum(bestValueCombo),
      bestValueCombo,
      bestWeightCombo
    )
  }
}
