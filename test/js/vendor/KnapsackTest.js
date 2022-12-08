import {DTest} from "../../DTestFramework.js";
import {Knapsack} from "../../../js/modules/Knapsack.js";
import {KnapsackLookupDTO} from "../../../js/modules/dtos/KnapsackLookupDTO.js";

const createLookupTableTest = new DTest('createLookupTableTest', function(params) {
  const lookupTable = (new Knapsack()).createLookupTable(params.maxIndex);

  this.assertEquals(lookupTable.length, params.expected);
  this.assertEquals(lookupTable.every(value => value instanceof KnapsackLookupDTO), true);
}, function() {
  return [
    {
      maxIndex: 0,
      expected: 1
    },
    {
      maxIndex: 8,
      expected: 9
    },
    {
      maxIndex: -5,
      expected: 0
    }
  ];
});

const unboundedTest = new DTest('unboundedTest', function(params) {
  const solution = (new Knapsack()).unbounded(params.values, params.weights, params.target);

  this.assertEquals(solution.sum, params.expectedSum);
  this.assertArrayEquals(solution.values, params.expectedValues);
  this.assertArrayEquals(solution.weights, params.expectedWeights);
}, function() {
  return [
    {
      values: [],
      weights: [],
      target: 0,
      expectedValues: [],
      expectedWeights: [],
      expectedSum: 0
    },
    {
      values: [1],
      weights: [1],
      target: 0,
      expectedValues: [],
      expectedWeights: [],
      expectedSum: 0
    },
    {
      values: [1],
      weights: [1],
      target: 1,
      expectedValues: [1],
      expectedWeights: [1],
      expectedSum: 1
    },
    {
      values: [1],
      weights: [1],
      target: 2,
      expectedValues: [1, 1],
      expectedWeights: [1, 1],
      expectedSum: 2
    },
    {
      values: [3, 1],
      weights: [2, 3],
      target: 3,
      expectedValues: [3],
      expectedWeights: [2],
      expectedSum: 3
    },
    {
      values: [1, 2, 4, 5],
      weights: [2, 3, 2, 4],
      target: 10,
      expectedValues: [4, 4, 4, 4, 4],
      expectedWeights: [2, 2, 2, 2, 2],
      expectedSum: 20
    },
    {
      values: [1, 2, 5],
      weights: [2, 3, 4],
      target: 10,
      expectedValues: [5, 5, 1],
      expectedWeights: [4, 4, 2],
      expectedSum: 11
    },
  ];
});

// Test execution
console.log('KnapsackTest');
createLookupTableTest.run();
unboundedTest.run();
