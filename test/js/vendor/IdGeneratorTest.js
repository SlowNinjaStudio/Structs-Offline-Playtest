import {DTest} from "../../DTestFramework.js";
import {IdGenerator} from "../../../js/modules/IdGenerator.js";

const makeTest = new DTest('makeTest', function(params) {
  const idGenerator = new IdGenerator();
  const id1 = idGenerator.generate(params.prefix);
  const id2 = idGenerator.generate(params.prefix);

  this.assertEquals(id1.length > 0, true);
  this.assertEquals(id2.length > 0, true);
  this.assertEquals(id1.indexOf(params.prefix), 0);
  this.assertEquals(id2.indexOf(params.prefix), 0);
  this.assertEquals(id1 === id2, false);
}, function() {
  return [
    {
      prefix: ''
    },
    {
      prefix: 'taco-'
    }
  ];
});

// Test execution
console.log('IdGeneratorTest');
makeTest.run();
