import {DTest, DTestSuite} from "../../DTestFramework.js";
import {Util} from "../../../js/modules/util/Util.js";

const titleCaseTest = new DTest('titleCaseTest', function(params) {
  const util = new Util();
  this.assertEquals(util.titleCase(params.text), params.expected);
}, function() {
  return [
    {
      text: 'hello world',
      expected: 'Hello World'
    },
    {
      text: 'HELLO WORLD',
      expected: 'Hello World'
    },
    {
      text: `who's that girl?`,
      expected: `Who's That Girl?`
    },
    {
      text: ` who's THAT giRL?`,
      expected: ` Who's That Girl?`
    }
  ];
});

// Test execution
DTestSuite.printSuiteHeader('UtilTest');
titleCaseTest.run();
