import {DTest, DTestSuite} from "../../DTestFramework.js";
import {AttackStructConstraint} from "../../../js/modules/constraints/AttackStructConstraint.js";
import {GameState} from "../../../js/modules/state/GameState.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";
import {CommandStructBuilder} from "../../../js/modules/CommandStructBuilder.js";
import {AIAttackParamsDTO} from "../../../js/modules/dtos/AIAttackParamsDTO.js";
import {UNIT_TYPES} from "../../../js/modules/Constants.js";

const isSatisfiedTest = new DTest('isSatisfiedTest', function(params) {
  const constraint = new AttackStructConstraint(new GameState())
  this.assertEquals(constraint.isSatisfied(params.attackParams), params.expected);
}, function() {
  const structBuilder = new StructBuilder();
  const commandStructBuilder = new CommandStructBuilder();
  return [
    {
      attackParams: new AIAttackParamsDTO(
        structBuilder.make(UNIT_TYPES.TANK),
        commandStructBuilder.make(UNIT_TYPES.COMMAND_SHIP)
      ),
      expected: false
    },
    {
      attackParams: new AIAttackParamsDTO(
        structBuilder.make(UNIT_TYPES.TANK),
        structBuilder.make(UNIT_TYPES.TANK)
      ),
      expected: true
    },
    {
      attackParams: new AIAttackParamsDTO(
        structBuilder.make(UNIT_TYPES.TANK),
        structBuilder.make(UNIT_TYPES.STEALTH_BOMBER)
      ),
      expected: true
    },
    {
      attackParams: new AIAttackParamsDTO(
        structBuilder.make(UNIT_TYPES.STEALTH_BOMBER),
        structBuilder.make(UNIT_TYPES.TANK)
      ),
      expected: false
    },
  ];
});

const couldSatisfyTest = new DTest('couldSatisfyTest', function(params) {
  const constraint = new AttackStructConstraint(new GameState())
  this.assertEquals(constraint.couldSatisfy(params.potentialStruct, params.attackParams), params.expected);
}, function() {
  const structBuilder = new StructBuilder();
  const commandStructBuilder = new CommandStructBuilder();
  return [
    {
      potentialStruct: structBuilder.make(UNIT_TYPES.TANK),
      attackParams: new AIAttackParamsDTO(
        structBuilder.make(UNIT_TYPES.TANK),
        commandStructBuilder.make(UNIT_TYPES.COMMAND_SHIP)
      ),
      expected: 1
    },
    {
      potentialStruct: structBuilder.make(UNIT_TYPES.SPACE_FRIGATE),
      attackParams: new AIAttackParamsDTO(
        structBuilder.make(UNIT_TYPES.TANK),
        commandStructBuilder.make(UNIT_TYPES.COMMAND_SHIP)
      ),
      expected: 0
    },
    {
      potentialStruct: structBuilder.make(UNIT_TYPES.GALACTIC_BATTLESHIP),
      attackParams: new AIAttackParamsDTO(
        structBuilder.make(UNIT_TYPES.TANK),
        commandStructBuilder.make(UNIT_TYPES.COMMAND_SHIP)
      ),
      expected: 1
    },
  ];
});

// Test execution
DTestSuite.printSuiteHeader('AttackStructConstraintTest');
isSatisfiedTest.run();
couldSatisfyTest.run();
