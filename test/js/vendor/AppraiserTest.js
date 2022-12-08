import {DTest} from "../../DTestFramework.js";
import {Appraiser} from "../../../js/modules/Appraiser.js";
import {AMBITS, UNIT_TYPES, UNITS_BY_AMBIT} from "../../../js/modules/Constants.js";

const calcUnitTypePriceTest = new DTest('calcUnitTypePriceTest', function(params) {
  this.assertEquals((new Appraiser()).calcUnitTypePrice(params.unitType), params.price);
}, function() {
  return [
    {
      unitType: UNIT_TYPES.STAR_FIGHTER,
      price: 2
    },
    {
      unitType: UNIT_TYPES.SPACE_FRIGATE,
      price: 2
    },
    {
      unitType: UNIT_TYPES.GALACTIC_BATTLESHIP,
      price: 4
    },
    {
      unitType: UNIT_TYPES.FIGHTER_JET,
      price: 2
    },
    {
      unitType: UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
      price: 3
    },
    {
      unitType: UNIT_TYPES.STEALTH_BOMBER,
      price: 3
    },
    {
      unitType: UNIT_TYPES.TANK,
      price: 2
    },
    {
      unitType: UNIT_TYPES.ARTILLERY,
      price: 3
    },
    {
      unitType: UNIT_TYPES.SAM_LAUNCHER,
      price: 2
    },
    {
      unitType: UNIT_TYPES.SUB,
      price: 3
    },
    {
      unitType: UNIT_TYPES.DESTROYER,
      price: 3
    },
    {
      unitType: UNIT_TYPES.CRUISER,
      price: 5
    },
  ];
});

const calcUnitTypeTacticalValueTest = new DTest('calcUnitTypeTacticalValueTest', function(params) {
  this.assertEquals((new Appraiser()).calcUnitTypeTacticalValue(params.unitType), params.tacticalValue);
}, function() {
  return [
    {
      unitType: UNIT_TYPES.STAR_FIGHTER,
      tacticalValue: 1.5
    },
    {
      unitType: UNIT_TYPES.SPACE_FRIGATE,
      tacticalValue: 2.5
    },
    {
      unitType: UNIT_TYPES.GALACTIC_BATTLESHIP,
      tacticalValue: 3.5
    },
    {
      unitType: UNIT_TYPES.FIGHTER_JET,
      tacticalValue: 1.5
    },
    {
      unitType: UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
      tacticalValue: 2.5
    },
    {
      unitType: UNIT_TYPES.STEALTH_BOMBER,
      tacticalValue: 2.5
    },
    {
      unitType: UNIT_TYPES.TANK,
      tacticalValue: 1.5
    },
    {
      unitType: UNIT_TYPES.ARTILLERY,
      tacticalValue: 2.5
    },
    {
      unitType: UNIT_TYPES.SAM_LAUNCHER,
      tacticalValue: 2.5
    },
    {
      unitType: UNIT_TYPES.SUB,
      tacticalValue: 2.5
    },
    {
      unitType: UNIT_TYPES.DESTROYER,
      tacticalValue: 2.5
    },
    {
      unitType: UNIT_TYPES.CRUISER,
      tacticalValue: 3.5
    },
  ];
});

const getUnitAppraisalsByAmbitTest = new DTest('getUnitAppraisalsByAmbitTest', function(params) {
  const appraiser = new Appraiser();
  const appraisals = appraiser.getUnitAppraisalsByAmbit(params.ambit);
  this.assertEquals(appraisals.length, UNITS_BY_AMBIT[params.ambit].length);
  for (let i = 0; i < UNITS_BY_AMBIT[params.ambit].length; i++) {
    this.assertEquals(appraisals[i].unitType, UNITS_BY_AMBIT[params.ambit][i]);
    this.assertEquals(appraisals[i].price, appraiser.calcUnitTypePrice(UNITS_BY_AMBIT[params.ambit][i]));
    this.assertEquals(appraisals[i].tacticalValue, appraiser.calcUnitTypeTacticalValue(UNITS_BY_AMBIT[params.ambit][i]));
  }
}, function () {
  return [
    { ambit: AMBITS.SPACE },
    { ambit: AMBITS.SKY },
    { ambit: AMBITS.LAND },
    { ambit: AMBITS.WATER },
  ];
});

const getAllFleetUnitAppraisalsTest = new DTest('getAllFleetUnitAppraisalsTest', function() {
  const appraiser = new Appraiser();
  const appraisalAmbitSet = appraiser.getAllFleetUnitAppraisals();
  this.assertEquals(appraisalAmbitSet[AMBITS.SPACE].length, UNITS_BY_AMBIT[AMBITS.SPACE].length);
  this.assertEquals(appraisalAmbitSet[AMBITS.SKY].length, UNITS_BY_AMBIT[AMBITS.SKY].length);
  this.assertEquals(appraisalAmbitSet[AMBITS.LAND].length, UNITS_BY_AMBIT[AMBITS.LAND].length);
  this.assertEquals(appraisalAmbitSet[AMBITS.WATER].length, UNITS_BY_AMBIT[AMBITS.WATER].length);
});

// Test execution
console.log('AppraiserTest');
calcUnitTypePriceTest.run();
calcUnitTypeTacticalValueTest.run();
getUnitAppraisalsByAmbitTest.run();
getAllFleetUnitAppraisalsTest.run();
