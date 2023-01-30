export class CounterUnitsMap {
  constructor() {
    this.map = new Map();
  }

  /**
   * @param {CounterUnitDTO} counterUnit
   */
  addCounterUnit(counterUnit) {
    let counterUnits = [];
    if (this.map.has(counterUnit.counters)) {
      counterUnits = this.map.get(counterUnit.counters);
    }
    counterUnits.push(counterUnit);
    this.map.set(counterUnit.counters, counterUnits);
  }
}
