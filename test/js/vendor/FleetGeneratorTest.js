import {DTest, DTestSuite} from "../../DTestFramework.js";
import {FleetGenerator} from "../../../js/modules/FleetGenerator.js";
import {AMBITS} from "../../../js/modules/Constants.js";
import {Fleet} from "../../../js/modules/Fleet.js";
import {Appraiser} from "../../../js/modules/Appraiser.js";

const divideBudgetTest = new DTest('divideBudgetTest', function(params) {
  const budgetByAmbit = (new FleetGenerator()).divideBudget(params.budget);

  this.assertEquals(budgetByAmbit.get(AMBITS.SPACE), params.budgetSpace);
  this.assertEquals(budgetByAmbit.get(AMBITS.SKY), params.budgetSky);
  this.assertEquals(budgetByAmbit.get(AMBITS.LAND), params.budgetLand);
  this.assertEquals(budgetByAmbit.get(AMBITS.WATER), params.budgetWater);
}, function() {
  return [
    {
      budget: 0,
      budgetSpace: 0,
      budgetSky: 0,
      budgetLand: 0,
      budgetWater: 0,
    },
    {
      budget: 8,
      budgetSpace: 2,
      budgetSky: 2,
      budgetLand: 2,
      budgetWater: 2,
    },
    {
      budget: 10,
      budgetSpace: 2,
      budgetSky: 2,
      budgetLand: 2,
      budgetWater: 2,
    },
    {
      budget: 1000,
      budgetSpace: 16,
      budgetSky: 12,
      budgetLand: 12,
      budgetWater: 20,
    },
  ];
});

const generateFleetTest = new DTest('generateFleetTest', function(params) {
  const fleet = new Fleet();
  (new FleetGenerator()).generateFleet(fleet, params.budget);
  const appraiser = new Appraiser();
  const spaceUnitsAsPrices = fleet.space
    .filter(struct => !!struct)
    .map(struct => appraiser.calcUnitTypePrice(struct.unitType));
  const skyUnitsAsPrices = fleet.sky
    .filter(struct => !!struct)
    .map(struct => appraiser.calcUnitTypePrice(struct.unitType));
  const landUnitsAsPrices = fleet.land
    .filter(struct => !!struct)
    .map(struct => appraiser.calcUnitTypePrice(struct.unitType));
  const waterUnitsAsPrices = fleet.water
    .filter(struct => !!struct)
    .map(struct => appraiser.calcUnitTypePrice(struct.unitType));

  this.assertSetEquality(spaceUnitsAsPrices, params.spaceUnitsAsPrices);
  this.assertSetEquality(skyUnitsAsPrices, params.skyUnitsAsPrices);
  this.assertSetEquality(landUnitsAsPrices, params.landUnitsAsPrices);
  this.assertSetEquality(waterUnitsAsPrices, params.waterUnitsAsPrices);
}, function() {
  return [
    {
      budget: 0,
      spaceUnitsAsPrices: [],
      skyUnitsAsPrices: [],
      landUnitsAsPrices: [],
      waterUnitsAsPrices: [],
    },
    {
      budget: 8,
      spaceUnitsAsPrices: [2],
      skyUnitsAsPrices: [2],
      landUnitsAsPrices: [2],
      waterUnitsAsPrices: [],
    },
    {
      budget: 20,
      spaceUnitsAsPrices: [2, 2],
      skyUnitsAsPrices: [2, 3],
      landUnitsAsPrices: [2, 3],
      waterUnitsAsPrices: [5],
    },
    {
      budget: 56,
      spaceUnitsAsPrices: [4, 4, 4, 2],
      skyUnitsAsPrices: [3, 3, 3, 3],
      landUnitsAsPrices: [3, 3, 3, 3],
      waterUnitsAsPrices: [5, 5, 3, 3],
    },
    {
      budget: 80,
      spaceUnitsAsPrices: [4, 4, 4, 4],
      skyUnitsAsPrices: [3, 3, 3, 3],
      landUnitsAsPrices: [3, 3, 3, 3],
      waterUnitsAsPrices: [5, 5, 5, 5],
    },

  ];
});

// Test execution
DTestSuite.printSuiteHeader('FleetGeneratorTest');
divideBudgetTest.run();
generateFleetTest.run();
