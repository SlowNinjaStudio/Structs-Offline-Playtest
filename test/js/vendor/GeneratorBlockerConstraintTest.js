import {DTest, DTestSuite} from "../../DTestFramework.js";
import {GameState} from "../../../js/modules/state/GameState.js";
import {AIAttackParamsDTO} from "../../../js/modules/dtos/AIAttackParamsDTO.js";
import {Player} from "../../../js/modules/Player.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";
import {AMBITS, UNIT_TYPES} from "../../../js/modules/Constants.js";
import {Planet} from "../../../js/modules/Planet.js";
import {GeneratorBlockerConstraint} from "../../../js/modules/constraints/GeneratorBlockerConstraint.js";

const isSatisfiedTest = new DTest('isSatisfiedTest', function() {
  const structBuilder = new StructBuilder();
  const generator = structBuilder.make(UNIT_TYPES.GENERATOR);
  const enemy = new Player('Enemy');
  const state = new GameState();
  state.enemy = enemy;
  state.enemy.planet = new Planet(enemy.id);
  generator.operatingAmbit = AMBITS.LAND;
  state.enemy.planet.addStruct(generator);
  const constraint = new GeneratorBlockerConstraint(state);
  const attackParams = new AIAttackParamsDTO(null, null);

  this.assertEquals(constraint.isSatisfied(attackParams), false);

  // Non-blocking defender
  const starFighter = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
  state.enemy.fleet.addStruct(starFighter);
  starFighter.defend(generator);

  this.assertEquals(constraint.isSatisfied(attackParams), false);

  // Blocking defender
  const tank = structBuilder.make(UNIT_TYPES.TANK);
  state.enemy.fleet.addStruct(tank);
  tank.defend(generator);

  this.assertEquals(constraint.isSatisfied(attackParams), true);

  // Additional blocking defender
  const artillery = structBuilder.make(UNIT_TYPES.ARTILLERY);
  state.enemy.fleet.addStruct(artillery);
  artillery.defend(generator);

  this.assertEquals(constraint.isSatisfied(attackParams), true);

  // Vacuously true if the generator is destroyed;
  generator.destroyStruct();

  this.assertEquals(constraint.isSatisfied(attackParams), true);
});

const couldSatisfyTest = new DTest('couldSatisfyTest', function(params) {
  const structBuilder = new StructBuilder();
  const generator = structBuilder.make(UNIT_TYPES.GENERATOR);
  const enemy = new Player('Enemy');
  const state = new GameState();
  state.enemy = enemy;
  state.enemy.planet = new Planet(enemy.id);
  generator.operatingAmbit = AMBITS.LAND;
  state.enemy.planet.addStruct(generator);
  const constraint = new GeneratorBlockerConstraint(state);
  const attackParams = new AIAttackParamsDTO(null, null);

  this.assertEquals(constraint.couldSatisfy(params.potentialStruct, attackParams), params.expected);
}, function() {
  const structBuilder = new StructBuilder();
  return [
    {
      potentialStruct: structBuilder.make(UNIT_TYPES.TANK),
      expected: 1
    },
    {
      potentialStruct: structBuilder.make(UNIT_TYPES.STAR_FIGHTER),
      expected: 0
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
      potentialStruct: structBuilder.make(UNIT_TYPES.ARTILLERY),
      expected: 1
    },
  ]
});

// Test execution
DTestSuite.printSuiteHeader('GeneratorBlockerConstraintTest');
isSatisfiedTest.run();
couldSatisfyTest.run();
