import {DTest} from "../../DTestFramework.js";
import {POWER_GENERATORS} from "../../../js/modules/Constants.js";
import {PowerGeneratorFactory} from "../../../js/modules/struct_components/PowerGeneratorFactory.js";

const makeTest = new DTest('makeTest', function(params) {
  const generator = (new PowerGeneratorFactory()).make(params.generatorName);

  this.assertEquals(generator.name, params.generatorName);
  this.assertEquals(generator.powerOutput, params.powerOutput);
}, function() {
  return [
    {
      generatorName: POWER_GENERATORS.GENERIC.NAME,
      powerOutput: POWER_GENERATORS.GENERIC.POWER_OUTPUT
    },
  ];
});

// Test execution
console.log('PowerGeneratorFactoryTest');
makeTest.run();
