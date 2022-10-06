export class AmbitDistribution {
  constructor() {
    this.space = 0;
    this.sky = 0;
    this.land = 0;
    this.water = 0;
  }

  /**
   * @param {string} ambit
   * @param {number} value
   */
  set(ambit, value) {
    this[ambit.toLowerCase()] = value;
  }

  /**
   * @param ambit
   * @return {number}
   */
  get(ambit) {
    return this[ambit.toLowerCase()];
  }

  /**
   * @param {string} ambit
   * @param {number} amount
   */
  increment(ambit, amount) {
    this[ambit.toLowerCase()] += amount;
  }

  /**
   * @return {number[]}
   */
  getAmbitValues() {
    return [this.space, this.sky, this.land, this.water];
  }

  /**
   * @return {number}
   */
  getAverage() {
    const ambitValues = this.getAmbitValues();
    return ambitValues.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    ) / ambitValues.length;
  }

  /**
   * @return {number}
   */
  getPopulationVariance() {
    const average = this.getAverage();
    let ambitValues = this.getAmbitValues();
    ambitValues = ambitValues.map(ambitValue => Math.pow(average - ambitValue, 2));
    return ambitValues.reduce((previous, current) => previous + current) / ambitValues.length;
  }

  /**
   * @param {AmbitDistribution} ambitDistribution
   * @return {AmbitDistribution}
   */
  add(ambitDistribution) {
    const newDistribution = new AmbitDistribution();
    newDistribution.space = this.space + ambitDistribution.space;
    newDistribution.sky = this.sky + ambitDistribution.sky;
    newDistribution.land = this.land + ambitDistribution.land;
    newDistribution.water = this.water + ambitDistribution.water;
    return newDistribution;
  }
}
