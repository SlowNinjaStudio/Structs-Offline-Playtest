import {AMBITS, MAX_FLEET_STRUCTS_PER_AMBIT, ORDER_OF_AMBITS, PLAYER_DEFAULTS, UNIT_TYPES} from "./Constants.js";
import {AmbitDistribution} from "./AmbitDistribution.js";

export class Fleet {
  /**
   * @param {string} playerId
   * @param {number} maxStructs
   * @param {Object} maxStructsPerAmbit
   */
  constructor(
    playerId = '',
    maxStructs = PLAYER_DEFAULTS.MAX_ACTIVE_FLEET_STRUCTS,
    maxStructsPerAmbit = MAX_FLEET_STRUCTS_PER_AMBIT
  ) {
    this.playerId = playerId;
    this.maxStructs = maxStructs;
    this.maxStructsPerAmbit = maxStructsPerAmbit;
    this.space = [];
    this.sky = [];
    this.land = [];
    this.water = [];

    this.initAmbits();
  }

  initAmbits() {
    const ambits = Object.values(AMBITS);
    for (let j = 0; j < ambits.length; j++) {
      for (let i = 0; i < this.maxStructsPerAmbit[ambits[j]]; i++) {
        this[ambits[j].toLowerCase()].push(null);
      }
    }
  }

  /**
   * @param {function} callback
   */
  forEachStruct(callback) {
    const ambits = Object.values(AMBITS);
    for (let j = 0; j < ambits.length; j++) {
      const ambitStructs = this[ambits[j].toLowerCase()];
      for (let i = 0; i < ambitStructs.length; i++) {
        const struct = ambitStructs[i];
        if (struct) {
          callback(struct);
        }
      }
    }
  }

  /**
   * @param {string} ambit
   * @param {string} id
   * @return {Struct}
   */
  findStructByAmbitAndId(ambit, id) {
    return this[ambit.toLowerCase()].find(fleetStruct => !!fleetStruct ? (fleetStruct.id === id) : false);
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
   * @param {string} ambit
   * @return {number}
   */
  numberOfStructsInAmbit(ambit) {
    return this[ambit.toLowerCase()].reduce((numStructs, struct) => numStructs + (!!struct ? 1 : 0), 0);
  }

  /**
   * @return {number}
   */
  numberOfStructs() {
    return Object.values(AMBITS).reduce((totalNumStructs, ambit) =>
        totalNumStructs + this.numberOfStructsInAmbit(ambit)
    , 0);
  }

  /**
   * @return {number}
   */
  capacityRemaining() {
    return this.maxStructs - this.numberOfStructs();
  }

  /**
   * @param {string} ambit
   * @return {number}
   */
  ambitCapacityRemaining(ambit) {
    return this.maxStructsPerAmbit[ambit] - this.numberOfStructsInAmbit(ambit);
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
   * @param {string} ambit
   * @param {number} index
   * @return {boolean}
   */
  isSlotAvailable(ambit, index) {
    if (index < 0 || index >= this.maxStructsPerAmbit[ambit]) {
      return false;
    }
    const slot = this[ambit.toLowerCase()][index];
    return slot === null || slot.isDestroyed;
  }

  /**
   * @param {Struct} struct
   * @param {number} index
   * @return {boolean}
   */
  canAddStruct(struct, index) {
    return this.isSlotAvailable(struct.operatingAmbit, index)
      && this.isCapacityRemaining()
      && this.isAmbitCapacityRemaining(struct.operatingAmbit)
      && !this.includes(struct);
  }

  /**
   * @param {string} ambit
   * @return {number}
   */
  findFreeAmbitSlot(ambit) {
    return this[ambit.toLowerCase()].indexOf(null);
  }

  /**
   * @param {Struct} struct
   * @param {number} index
   * @return {boolean}
   */
  addStruct(struct, index= -1) {
    index = index > -1 ? index : this.findFreeAmbitSlot(struct.operatingAmbit);
    if (this.canAddStruct(struct, index)) {
      struct.playerId = this.playerId;
      struct.setAmbitSlot(index);
      this[struct.operatingAmbit.toLowerCase()][index] = struct;
      return true;
    }
    return false;
  }

  /**
   * @param {string} ambit
   * @param {number} index
   */
  clearSlot(ambit, index) {
    if (this[ambit.toLowerCase()][index]) {
      this[ambit.toLowerCase()][index].playerId = '';
      this[ambit.toLowerCase()][index].clearAmbitSlot();
      this[ambit.toLowerCase()][index] = null;
    }
  }

  /**
   * @param {string} ambit
   * @param {string} id
   * @return {boolean}
   */
  removeStructByAmbitAndId(ambit, id) {
    const index = this[ambit.toLowerCase()].findIndex(fleetStruct => !!fleetStruct ? (fleetStruct.id === id) : false);
    if (index < 0) {
      return false;
    }
    this.clearSlot(ambit, index);
    return true;
  }

  /**
   * @return {boolean}
   */
  isDestroyed() {
    if (this.numberOfStructs() === 0) {
      return false;
    }

    let destroyed = true;

    this.forEachStruct(struct => {
      if (!!struct && !struct.isDestroyed) {
        destroyed = false;
      }
    });

    return destroyed;
  }

  reset() {
    this.space = [];
    this.sky = [];
    this.land = [];
    this.water = [];

    this.initAmbits();
  }

  /**
   * @return {number}
   */
  generatePower() {
    let powerGenerated = 0;
    this.forEachStruct(function(struct) {
      if (!struct.isDestroyed && struct.powerGenerator) {
        powerGenerated += struct.powerGenerator.powerOutput;
      }
    });
    return powerGenerated;
  }

  /**
   * @param {boolean} removedDestroyed
   * @return {Struct[]}
   */
  toFlatArray(removedDestroyed = true) {
    return Object.values(ORDER_OF_AMBITS).reduce((structs, ambit) =>
        [...structs, ...this[ambit.toLowerCase()].filter(ambitStruct =>
          !!ambitStruct && (!removedDestroyed || !ambitStruct.isDestroyed)
        )], []);
  }

  /**
   * @return {Struct|null}
   */
  findGenerator() {
    let generator = null;
    this.forEachStruct(struct => {
      if (struct.unitType === UNIT_TYPES.GENERATOR) {
        generator = struct;
      }
    });
    return generator;
  }

  /**
   * @return {AmbitDistribution}
   */
  analyzeFleetAmbitAttackCapabilities() {
    const ambitAttackCapabilities = new AmbitDistribution();
    this.forEachStruct(struct => {
      if (!struct.isDestroyed) {
        const targetableAmbits = struct.getTargetableAmbits();
        targetableAmbits.forEach(ambit => {
          ambitAttackCapabilities.increment(ambit, 1);
        });
      }
    });
    return ambitAttackCapabilities;
  }
}
