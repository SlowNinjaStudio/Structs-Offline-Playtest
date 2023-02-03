import {DTest} from "../../DTestFramework.js";
import {GameState} from "../../../js/modules/state/GameState.js";
import {AIAttackParamsDTO} from "../../../js/modules/dtos/AIAttackParamsDTO.js";
import {Player} from "../../../js/modules/Player.js";
import {CommandStructBlockerConstraint} from "../../../js/modules/constraints/CommandStructBlockerConstraint.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";
import {AMBITS, UNIT_TYPES} from "../../../js/modules/Constants.js";

const isSatisfiedTest = new DTest('isSatisfiedTest', function() {
  const enemy = new Player('Enemy');
  const state = new GameState();
  state.enemy = enemy;
  state.enemy.commandStruct.operatingAmbit = AMBITS.SPACE;

  const constraint = new CommandStructBlockerConstraint(state);
  const attackParams = new AIAttackParamsDTO(null, null);

  this.assertEquals(constraint.isSatisfied(attackParams), false);

  const structBuilder = new StructBuilder();
  const tank = structBuilder.make(UNIT_TYPES.TANK);
  state.enemy.fleet.addStruct(tank);
  tank.defend(state.enemy.commandStruct);

  this.assertEquals(constraint.isSatisfied(attackParams), false);

  const starFighter = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
  state.enemy.fleet.addStruct(starFighter);
  starFighter.defend(state.enemy.commandStruct);

  this.assertEquals(constraint.isSatisfied(attackParams), true);

  const spaceFrigate = structBuilder.make(UNIT_TYPES.SPACE_FRIGATE);
  state.enemy.fleet.addStruct(spaceFrigate);
  spaceFrigate.defend(state.enemy.commandStruct);

  this.assertEquals(constraint.isSatisfied(attackParams), true);
});

const couldSatisfyTest = new DTest('couldSatisfyTest', function(params) {
  const enemy = new Player('Enemy');
  const state = new GameState();
  state.enemy = enemy;
  state.enemy.commandStruct.operatingAmbit = AMBITS.SPACE;

  const constraint = new CommandStructBlockerConstraint(state);
  const attackParams = new AIAttackParamsDTO(null, null);

  this.assertEquals(constraint.couldSatisfy(params.potentialStruct, attackParams), params.expected);
}, function() {
  const structBuilder = new StructBuilder();
  return [
    {
      potentialStruct: structBuilder.make(UNIT_TYPES.TANK),
      expected: 0
    },
    {
      potentialStruct: structBuilder.make(UNIT_TYPES.STAR_FIGHTER),
      expected: 1
    },
    {
      potentialStruct: structBuilder.make(UNIT_TYPES.FIGHTER_JET),
      expected: 0
    },
    {
      potentialStruct: structBuilder.make(UNIT_TYPES.SUB),
      expected: 0
    },
    {
      potentialStruct: structBuilder.make(UNIT_TYPES.SPACE_FRIGATE),
      expected: 1
    },
  ]
});



// Test execution
console.log('CommandStructBlockerConstraintTest');
isSatisfiedTest.run();
couldSatisfyTest.run();
