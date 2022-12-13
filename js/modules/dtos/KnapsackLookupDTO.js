export class KnapsackLookupDTO {
  /**
   * @param {number} sum
   * @param {number[]} values
   * @param {number[]} weights
   */
  constructor(sum = 0, values = [], weights = []) {
    this.sum = sum;
    this.values = values;
    this.weights = weights;
  }
}
