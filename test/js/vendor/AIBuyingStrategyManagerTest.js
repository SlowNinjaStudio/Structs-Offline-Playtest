import {DTest, DTestSuite} from "../../DTestFramework.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";
import {Player} from "../../../js/modules/Player.js";
import {GameState} from "../../../js/modules/state/GameState.js";
import {Planet} from "../../../js/modules/Planet.js";
import {AMBITS, CONSTRAINTS, FLEET_UNIT_TYPES, UNIT_TYPES} from "../../../js/modules/Constants.js";
import {AIAttackParamsDTO} from "../../../js/modules/dtos/AIAttackParamsDTO.js";
import {AIBuyingStrategyManager} from "../../../js/modules/AIBuyingStrategyManager.js";

/**
 * @return {GameState}
 */
function getDummyState() {
  const structBuilder = new StructBuilder();
  const player = new Player('Player');
  const enemy = new Player('Enemy');
  const state = new GameState();
  state.arePlanetsEnabled = true;
  state.player = player;
  state.enemy = enemy;
  state.player.planet = new Planet(state.player.id);
  state.enemy.planet = new Planet(state.player.id);
  state.player.commandStruct.operatingAmbit = AMBITS.SPACE;
  state.enemy.commandStruct.operatingAmbit = AMBITS.SPACE;
  const playerGenerator = structBuilder.make(UNIT_TYPES.GENERATOR);
  const enemyGenerator = structBuilder.make(UNIT_TYPES.GENERATOR);
  playerGenerator.operatingAmbit = AMBITS.LAND;
  enemyGenerator.operatingAmbit = AMBITS.LAND;
  state.player.planet.addStruct(playerGenerator);
  state.enemy.planet.addStruct(enemyGenerator);
  return state;
}

const findConstraintSatisfyingStructTest = new DTest('findConstraintSatisfyingStructTest', function() {
  const state = getDummyState();
  const ai = new AIBuyingStrategyManager(state);

  ai.orderedConstrainstList = [
    CONSTRAINTS.ATTACK_STRUCT,
    CONSTRAINTS.COMMAND_STRUCT_BLOCKER
  ];

  state.enemy.creditManager.credits = 10;

  state.player.commandStruct.operatingAmbit = AMBITS.SKY;
  state.enemy.commandStruct.operatingAmbit = AMBITS.WATER;

  const attackParams = new AIAttackParamsDTO(
    state.player.commandStruct,
    state.enemy.commandStruct,
  );

  ai.fleetUnitTypes = [
    UNIT_TYPES.STAR_FIGHTER // Can't target or block
  ];

  let structDTO = ai.findConstraintSatisfyingStruct(CONSTRAINTS.ATTACK_STRUCT, 0, attackParams);
  this.assertEquals(structDTO.unit, null);

  ai.fleetUnitTypes = [
    UNIT_TYPES.STAR_FIGHTER, // Can't target or block
    UNIT_TYPES.SAM_LAUNCHER, // Can target but not block
  ];

  structDTO = ai.findConstraintSatisfyingStruct(CONSTRAINTS.ATTACK_STRUCT, 0, attackParams);
  this.assertEquals(structDTO.unit.unitType, UNIT_TYPES.SAM_LAUNCHER);

  ai.fleetUnitTypes = [
    UNIT_TYPES.STAR_FIGHTER, // Can't target or block
    UNIT_TYPES.SAM_LAUNCHER, // Can target but not block
    UNIT_TYPES.CRUISER, // Can target and block
    UNIT_TYPES.SUB, // Can't target but can block
  ];

  structDTO = ai.findConstraintSatisfyingStruct(CONSTRAINTS.ATTACK_STRUCT, 0, attackParams);
  this.assertEquals(structDTO.unit.unitType, UNIT_TYPES.CRUISER);

  ai.fleetUnitTypes = [
    UNIT_TYPES.STAR_FIGHTER, // Can't target or block
    UNIT_TYPES.SAM_LAUNCHER, // Can target but not block
    UNIT_TYPES.CRUISER, // Can target and block
    UNIT_TYPES.SUB, // Can't target but can block
    UNIT_TYPES.DESTROYER, // Can target and block and cheaper
  ];

  structDTO = ai.findConstraintSatisfyingStruct(CONSTRAINTS.ATTACK_STRUCT, 0, attackParams);
  this.assertEquals(structDTO.unit.unitType, UNIT_TYPES.DESTROYER);

  ai.fleetUnitTypes = FLEET_UNIT_TYPES;

  structDTO = ai.findConstraintSatisfyingStruct(CONSTRAINTS.ATTACK_STRUCT, 0, attackParams);
  this.assertEquals(structDTO.unit.unitType, UNIT_TYPES.DESTROYER);
});

// Test execution
DTestSuite.printSuiteHeader('AIBuyingStrategyManagerTest');
findConstraintSatisfyingStructTest.run();
