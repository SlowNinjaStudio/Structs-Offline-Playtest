import {DTest, DTestSuite} from "../../DTestFramework.js";
import {GameState} from "../../../js/modules/state/GameState.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";
import {AIAttackParamsDTO} from "../../../js/modules/dtos/AIAttackParamsDTO.js";
import {UNIT_TYPES} from "../../../js/modules/Constants.js";
import {Player} from "../../../js/modules/Player.js";
import {AmbitCoverageConstraint} from "../../../js/modules/constraints/AmbitCoverageConstraint.js";

const isSatisfiedTest = new DTest('isSatisfiedTest', function(params) {
  const structBuilder = new StructBuilder();
  const enemy = new Player('Enemy');
  const state = new GameState();
  state.enemy = enemy;

  params.unitTypes.forEach(unitType => {
    state.enemy.fleet.addStruct(structBuilder.make(unitType));
  });

  const constraint = new AmbitCoverageConstraint(state);
  const attackParams = new AIAttackParamsDTO(null, null);

  this.assertEquals(constraint.isSatisfied(attackParams), params.expected);
}, function() {
  return [
    {
      unitTypes: [
        UNIT_TYPES.TANK
      ],
      expected: false
    },
    {
      unitTypes: [
        UNIT_TYPES.STAR_FIGHTER,
        UNIT_TYPES.FIGHTER_JET,
        UNIT_TYPES.TANK,
        UNIT_TYPES.SUB,
      ],
      expected: true
    },
    {
      unitTypes: [
        UNIT_TYPES.GALACTIC_BATTLESHIP,
        UNIT_TYPES.CRUISER,
      ],
      expected: true
    },
    {
      unitTypes: [
        UNIT_TYPES.STAR_FIGHTER,
        UNIT_TYPES.SPACE_FRIGATE,
        UNIT_TYPES.FIGHTER_JET,
        UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
        UNIT_TYPES.SAM_LAUNCHER,
        UNIT_TYPES.SUB,
        UNIT_TYPES.DESTROYER,
      ],
      expected: false
    },
  ];
});

const couldSatisfyTest = new DTest('couldSatisfyTest', function(params) {
  const structBuilder = new StructBuilder();
  const enemy = new Player('Enemy');
  const state = new GameState();
  state.enemy = enemy;

  params.unitTypes.forEach(unitType => {
    state.enemy.fleet.addStruct(structBuilder.make(unitType));
  });

  const constraint = new AmbitCoverageConstraint(state);
  const attackParams = new AIAttackParamsDTO(null, null);
  const potentialStruct = structBuilder.make(params.potentialStructUnitType);

  this.assertEquals(constraint.couldSatisfy(potentialStruct, attackParams), params.expected);
}, function() {
  return [
    {
      unitTypes: [
        UNIT_TYPES.TANK
      ],
      potentialStructUnitType: UNIT_TYPES.TANK,
      expected: 0
    },
    {
      unitTypes: [],
      potentialStructUnitType: UNIT_TYPES.TANK,
      expected: 0.25
    },
    {
      unitTypes: [
        UNIT_TYPES.TANK,
      ],
      potentialStructUnitType: UNIT_TYPES.STAR_FIGHTER,
      expected: 0.50
    },
    {
      unitTypes: [
        UNIT_TYPES.TANK,
      ],
      potentialStructUnitType: UNIT_TYPES.SUB,
      expected: 0.75
    },
    {
      unitTypes: [
        UNIT_TYPES.FIGHTER_JET
      ],
      potentialStructUnitType: UNIT_TYPES.GALACTIC_BATTLESHIP,
      expected: 1
    },
    {
      unitTypes: [
        UNIT_TYPES.CRUISER
      ],
      potentialStructUnitType: UNIT_TYPES.GALACTIC_BATTLESHIP,
      expected: 1
    },
  ];
});

// Test execution
DTestSuite.printSuiteHeader('AmbitCoverageConstraintTest');
isSatisfiedTest.run();
couldSatisfyTest.run();
