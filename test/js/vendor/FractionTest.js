import {DTest, DTestSuite} from "../../DTestFramework.js";
import {Fraction} from "../../../js/modules/util/Fraction.js";

const toDecimalTest = new DTest('toDecimalTest', function(params) {
  const fraction = new Fraction(params.numerator, params.denominator);
  this.assertEquals(fraction.toDecimal(), params.expected);
}, function() {
  return [
    {
      numerator: 3,
      denominator: 4,
      expected: 0.75
    },
    {
      numerator: 12,
      denominator: 3,
      expected: 4
    },
    {
      numerator: 5,
      denominator: 4,
      expected: 1.25
    }
  ];
});

const toStringTest = new DTest('toStringTest', function(params) {
  const fraction = new Fraction(params.numerator, params.denominator);
  this.assertEquals(fraction.toString(), params.expected);
}, function() {
  return [
    {
      numerator: 3,
      denominator: 4,
      expected: '3/4'
    },
    {
      numerator: 12,
      denominator: 3,
      expected: '12/3'
    }
  ];
});

// Test execution
DTestSuite.printSuiteHeader('FractionTest');
toDecimalTest.run();
toStringTest.run();
