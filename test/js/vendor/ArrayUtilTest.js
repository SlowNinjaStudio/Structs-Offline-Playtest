import {DTest} from "../../DTestFramework.js";
import {ArrayUtil} from "../../../js/modules/util/ArrayUtil.js";

const sumTest = new DTest('sumTest', function(params) {
  const util = new ArrayUtil();
  this.assertEquals(util.sum(params.array), params.expected);
}, function() {
  return [
    {
      array: [],
      expected: 0
    },
    {
      array: [3],
      expected: 3
    },
    {
      array: [1, 2, 3],
      expected: 6
    },
  ];
});

const maxTest = new DTest('maxTest', function(params) {
  const util = new ArrayUtil();
  this.assertEquals(util.max(params.array), params.expected);
}, function() {
  return [
    {
      array: [],
      expected: -Infinity
    },
    {
      array: [2],
      expected: 2
    },
    {
      array: [1, 3, 2],
      expected: 3
    },
  ];
});

const minTest = new DTest('minTest', function(params) {
  const util = new ArrayUtil();
  this.assertEquals(util.min(params.array), params.expected);
}, function() {
  return [
    {
      array: [],
      expected: Infinity
    },
    {
      array: [2],
      expected: 2
    },
    {
      array: [3, 2, 1, 5],
      expected: 1
    },
  ];
});

// Test execution
console.log('ArrayUtilTest');
sumTest.run();
maxTest.run();
minTest.run();
