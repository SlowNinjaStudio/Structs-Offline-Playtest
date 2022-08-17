import {AMBITS, MAX_FLEET_STRUCTS_PER_AMBIT, PLAYER_DEFAULTS} from "./Constants.js";

export class Fleet {
  /**
   *
   * @param {number} maxStructs
   * @param {Object} maxStructsPerAmbit
   */
  constructor(
    maxStructs = PLAYER_DEFAULTS.MAX_ACTIVE_FLEET_STRUCTS,
    maxStructsPerAmbit = MAX_FLEET_STRUCTS_PER_AMBIT
  ) {
    this.maxStructs = maxStructs;
    this.maxStructsPerAmbit = maxStructsPerAmbit;
    this.space = [];
    this.sky = [];
    this.land = [];
    this.water = [];
  }

  /**
   * @param {string} ambit
   * @param {string} id
   * @return {Struct}
   */
  findStructByAmbitAndId(ambit, id) {
    return this[ambit.toLowerCase()].find(fleetStruct => fleetStruct.id === id);
  }

  /**
   * @param {string} id
   * @return {Struct}
   */
  findStructById(id) {
    const ambits = Object.values(AMBITS);
    let found;
    for (let i = 0; i < ambits.length; i++ ) {
      found = found || this.findStructByAmbitAndId(ambits[i], id);
    }
    return found;
  }

  /**
   * @param {Struct} struct
   * @return {boolean}
   */
  includes(struct) {
    return !!this.findStructByAmbitAndId(struct.operatingAmbit, struct.id);
  }

  /**
   * @return {number}
   */
  numberOfStructsStored() {
    return this.space.length + this.sky.length + this.land.length + this.water.length;
  }

  /**
   * @return {number}
   */
  capacityRemaining() {
    return this.maxStructs - this.numberOfStructsStored();
  }

  /**
   * @param {string} ambit
   * @return {number}
   */
  ambitCapacityRemaining(ambit) {
    return this.maxStructsPerAmbit[ambit] - this[ambit.toLowerCase()].length;
  }

  /**
   * @return {boolean}
   */
  isCapacityRemaining() {
    return this.capacityRemaining() > 0
  }

  /**
   * @param {string} ambit
   * @return {boolean}
   */
  isAmbitCapacityRemaining(ambit) {
    return this.ambitCapacityRemaining(ambit) > 0;
  }

  /**
   * @param {Struct} struct
   * @return {boolean}
   */
  canAddStruct(struct) {
    return this.isCapacityRemaining()
      && this.isAmbitCapacityRemaining(struct.operatingAmbit)
      && !this.includes(struct);
  }

  /**
   * @param {Struct} struct
   * @return {boolean}
   */
  addStruct(struct) {
    if (this.canAddStruct(struct)) {
      this[struct.operatingAmbit.toLowerCase()].push(struct);
      return true;
    }
    return false;
  }

  /**
   * @param {string} ambit
   * @param {string} id
   * @return {boolean}
   */
  removeStructByAmbitAndId(ambit, id) {
    const index = this[ambit.toLowerCase()].findIndex(fleetStruct => fleetStruct.id === id);
    if (index < 0) {
      return false;
    }
    const removed = this[ambit.toLowerCase()].splice(index, 1);
    return removed.length > 0;
  }
}
