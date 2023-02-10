import {DTest, DTestSuite} from "../../DTestFramework.js";
import {GameState} from "../../../js/modules/state/GameState.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";
import {AllCounterUnitsConstraint} from "../../../js/modules/constraints/AllCounterUnitsConstraint.js";
import {Player} from "../../../js/modules/Player.js";
import {UNIT_TYPES} from "../../../js/modules/Constants.js";
import {Fleet} from "../../../js/modules/Fleet.js";
import {AIAttackParamsDTO} from "../../../js/modules/dtos/AIAttackParamsDTO.js";

const isSatisfiedTest = new DTest('isSatisfiedTest', function(params) {
  const structBuilder = new StructBuilder();
  const state = new GameState();
  state.player = new Player('Player');
  state.enemy = new Player('Enemy');
  params.playerUnitTypes.forEach(unitType => {
    state.player.fleet.addStruct(structBuilder.make(unitType));
  });
  params.enemyUnitTypes.forEach(unitType => {
    state.enemy.fleet.addStruct(structBuilder.make(unitType));
  });
  const constraint = new AllCounterUnitsConstraint(state);
  this.assertEquals(constraint.isSatisfied(params.attackParams), params.expected);
}, function() {

  return [
    {
      playerUnitTypes: [],
      enemyUnitTypes: [],
      expected: true
    },
    {
      playerUnitTypes: [UNIT_TYPES.TANK],
      enemyUnitTypes: [],
      expected: false
    },
    {
      playerUnitTypes: [],
      enemyUnitTypes: [UNIT_TYPES.TANK],
      expected: true
    },
    {
      playerUnitTypes: [UNIT_TYPES.TANK],
      enemyUnitTypes: [UNIT_TYPES.STEALTH_BOMBER],
      expected: true
    },
    {
      playerUnitTypes: [UNIT_TYPES.FIGHTER_JET],
      enemyUnitTypes: [UNIT_TYPES.SAM_LAUNCHER],
      expected: false
    },
    {
      playerUnitTypes: [
        UNIT_TYPES.STAR_FIGHTER,
        UNIT_TYPES.SPACE_FRIGATE,
        UNIT_TYPES.FIGHTER_JET,
        UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
        UNIT_TYPES.SAM_LAUNCHER,
        UNIT_TYPES.TANK,
        UNIT_TYPES.CRUISER,
        UNIT_TYPES.SUB,
      ],
      enemyUnitTypes: [
        UNIT_TYPES.SUB,
        UNIT_TYPES.CRUISER,
        UNIT_TYPES.SAM_LAUNCHER,
        UNIT_TYPES.TANK,
        UNIT_TYPES.STEALTH_BOMBER,
        UNIT_TYPES.GALACTIC_BATTLESHIP,
      ],
      expected: true
    },
    {
      playerUnitTypes: [
        UNIT_TYPES.STAR_FIGHTER,
        UNIT_TYPES.SPACE_FRIGATE,
        UNIT_TYPES.SPACE_FRIGATE,
        UNIT_TYPES.STAR_FIGHTER,
        UNIT_TYPES.FIGHTER_JET,
        UNIT_TYPES.FIGHTER_JET,
        UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
        UNIT_TYPES.STEALTH_BOMBER,
        UNIT_TYPES.SAM_LAUNCHER,
        UNIT_TYPES.TANK,
        UNIT_TYPES.ARTILLERY,
        UNIT_TYPES.TANK,
        UNIT_TYPES.CRUISER,
        UNIT_TYPES.SUB,
        UNIT_TYPES.DESTROYER,
        UNIT_TYPES.SUB,
      ],
      enemyUnitTypes: [
        UNIT_TYPES.SUB,
        UNIT_TYPES.SUB,
        UNIT_TYPES.CRUISER,
        UNIT_TYPES.SAM_LAUNCHER,
        UNIT_TYPES.TANK,
        UNIT_TYPES.TANK,
        UNIT_TYPES.STEALTH_BOMBER,
        UNIT_TYPES.GALACTIC_BATTLESHIP,
        UNIT_TYPES.SPACE_FRIGATE,
      ],
      expected: true
    },
  ];
});

const findAllCounterableUnitsTest = new DTest('findAllCounterableUnitsTest', function(params) {
  const structBuilder = new StructBuilder();
  const targetFleet = new Fleet();
  const constraint = new AllCounterUnitsConstraint(new GameState());
  const attackingUnit = structBuilder.make(params.attackingUnitType);

  params.targetFleetUnitTypes.forEach(unitType => {
    targetFleet.addStruct(structBuilder.make(unitType));
  });

  const counterableUnits = constraint.findAllCounterableUnits(targetFleet, attackingUnit);
  const counterableUnitTypes = counterableUnits.map(unit => unit.unitType);

  this.assertSetEquality(counterableUnitTypes, params.expected);
}, function () {
  return [
    {
      targetFleetUnitTypes: [],
      attackingUnitType: UNIT_TYPES.CRUISER,
      expected: []
    },
    {
      targetFleetUnitTypes: [UNIT_TYPES.TANK, UNIT_TYPES.SUB],
      attackingUnitType: UNIT_TYPES.CRUISER,
      expected: [UNIT_TYPES.TANK]
    },
    {
      targetFleetUnitTypes: [UNIT_TYPES.SPACE_FRIGATE, UNIT_TYPES.FIGHTER_JET, UNIT_TYPES.SUB, UNIT_TYPES.SAM_LAUNCHER],
      attackingUnitType: UNIT_TYPES.CRUISER,
      expected: [UNIT_TYPES.FIGHTER_JET, UNIT_TYPES.SAM_LAUNCHER]
    }
  ];
});

const haveCountersInFleetTest = new DTest('haveCountersInFleetTest', function(params) {
  const structBuilder = new StructBuilder();
  const targetStructs = [];
  const oppositionFleet = new Fleet();
  const constraint = new AllCounterUnitsConstraint(new GameState());

  params.targetStructUnitTypes.forEach(unitType => {
    targetStructs.push(structBuilder.make(unitType));
  });

  params.oppositionFleetUnitTypes.forEach(unitType => {
    oppositionFleet.addStruct(structBuilder.make(unitType));
  });

  this.assertEquals(constraint.haveCountersInFleet(targetStructs, oppositionFleet), params.expected);
}, function () {
  return [
    {
      targetStructUnitTypes: [],
      oppositionFleetUnitTypes: [],
      expected: true
    },
    {
      targetStructUnitTypes: [UNIT_TYPES.TANK],
      oppositionFleetUnitTypes: [],
      expected: false
    },
    {
      targetStructUnitTypes: [],
      oppositionFleetUnitTypes: [UNIT_TYPES.TANK],
      expected: true
    },
    {
      targetStructUnitTypes: [UNIT_TYPES.STEALTH_BOMBER],
      oppositionFleetUnitTypes: [UNIT_TYPES.TANK],
      expected: false
    },
    {
      targetStructUnitTypes: [
        UNIT_TYPES.STAR_FIGHTER,
        UNIT_TYPES.SPACE_FRIGATE,
        UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
      ],
      oppositionFleetUnitTypes: [
        UNIT_TYPES.STAR_FIGHTER,
        UNIT_TYPES.SPACE_FRIGATE,
        UNIT_TYPES.GALACTIC_BATTLESHIP,
        UNIT_TYPES.FIGHTER_JET,
        UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
        UNIT_TYPES.STEALTH_BOMBER,
        UNIT_TYPES.TANK,
        UNIT_TYPES.ARTILLERY,
        UNIT_TYPES.DESTROYER,
        UNIT_TYPES.CRUISER,
      ],
      expected: false
    },
    {
      targetStructUnitTypes: [
        UNIT_TYPES.STAR_FIGHTER,
        UNIT_TYPES.SPACE_FRIGATE,
        UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
      ],
      oppositionFleetUnitTypes: [
        UNIT_TYPES.STAR_FIGHTER,
        UNIT_TYPES.SPACE_FRIGATE,
        UNIT_TYPES.GALACTIC_BATTLESHIP,
        UNIT_TYPES.FIGHTER_JET,
        UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
        UNIT_TYPES.STEALTH_BOMBER,
        UNIT_TYPES.TANK,
        UNIT_TYPES.ARTILLERY,
        UNIT_TYPES.SAM_LAUNCHER,
        UNIT_TYPES.SUB,
        UNIT_TYPES.DESTROYER,
        UNIT_TYPES.CRUISER,
      ],
      expected: true
    },
  ];
});

const couldSatisfyTest = new DTest('couldSatisfyTest', function(params) {
  const structBuilder = new StructBuilder();
  const potentialStruct = structBuilder.make(params.potentialStructUnitType);
  const attackParams = new AIAttackParamsDTO(null, null);
  const state = new GameState();
  state.player = new Player('Player');
  state.enemy = new Player('Enemy');

  params.playerFleetUnitTypes.forEach(unitType => {
    state.player.fleet.addStruct(structBuilder.make(unitType));
  });

  params.enemyFleetUnitTypes.forEach(unitType => {
    state.enemy.fleet.addStruct(structBuilder.make(unitType));
  });

  const constraint = new AllCounterUnitsConstraint(state);

  this.assertEquals(constraint.couldSatisfy(potentialStruct, attackParams), params.expected);
}, function() {
  return [
    {
      playerFleetUnitTypes: [],
      enemyFleetUnitTypes: [],
      potentialStructUnitType: UNIT_TYPES.TANK,
      expected: 0
    },
    {
      playerFleetUnitTypes: [
        UNIT_TYPES.STAR_FIGHTER,
        UNIT_TYPES.FIGHTER_JET,
        UNIT_TYPES.TANK,
        UNIT_TYPES.SUB
      ],
      enemyFleetUnitTypes: [],
      potentialStructUnitType: UNIT_TYPES.TANK,
      expected: 0
    },
    {
      playerFleetUnitTypes: [
        UNIT_TYPES.STAR_FIGHTER,
        UNIT_TYPES.FIGHTER_JET,
        UNIT_TYPES.SAM_LAUNCHER,
        UNIT_TYPES.SUB
      ],
      enemyFleetUnitTypes: [],
      potentialStructUnitType: UNIT_TYPES.TANK,
      expected: 1
    },
    {
      playerFleetUnitTypes: [
        UNIT_TYPES.STAR_FIGHTER,
        UNIT_TYPES.FIGHTER_JET,
        UNIT_TYPES.SAM_LAUNCHER,
        UNIT_TYPES.SUB
      ],
      enemyFleetUnitTypes: [UNIT_TYPES.ARTILLERY],
      potentialStructUnitType: UNIT_TYPES.TANK,
      expected: 0
    },
    {
      playerFleetUnitTypes: [
        UNIT_TYPES.STAR_FIGHTER,
        UNIT_TYPES.FIGHTER_JET,
        UNIT_TYPES.SAM_LAUNCHER,
        UNIT_TYPES.SUB
      ],
      enemyFleetUnitTypes: [UNIT_TYPES.ARTILLERY, UNIT_TYPES.SUB, UNIT_TYPES.CRUISER],
      potentialStructUnitType: UNIT_TYPES.STAR_FIGHTER,
      expected: 0
    },
  ];
});

// Test execution
DTestSuite.printSuiteHeader('AllCounterUnitsConstraintTest');
isSatisfiedTest.run();
findAllCounterableUnitsTest.run();
haveCountersInFleetTest.run();
couldSatisfyTest.run();
