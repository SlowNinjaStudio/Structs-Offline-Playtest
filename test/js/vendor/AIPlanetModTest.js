import {DTest, DTestSuite} from "../../DTestFramework.js";
import {GameState} from "../../../js/modules/state/GameState.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";
import {AMBITS, UNIT_TYPES} from "../../../js/modules/Constants.js";
import {Player} from "../../../js/modules/Player.js";
import {AIPlanetMod} from "../../../js/modules/AIPlanetMod.js";
import {Planet} from "../../../js/modules/Planet.js";
import {FleetGenerator} from "../../../js/modules/FleetGenerator.js";

/**
 * @return {GameState}
 */
function getDummyStateWithPlanets() {
  const structBuilder = new StructBuilder();
  const fleetGenerator = new FleetGenerator();
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
  fleetGenerator.generateCuratedFleet(state.player.fleet);
  fleetGenerator.generateCuratedFleet(state.enemy.fleet);
  return state;
}

const countUnitTypeTest = new DTest('countUnitTypeTest', function() {
  const structBuilder = new StructBuilder();
  const enemy = new Player('Enemy');
  const state = new GameState();
  state.enemy = enemy;
  state.enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.STAR_FIGHTER));
  state.enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.SPACE_FRIGATE));
  state.enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.GALACTIC_BATTLESHIP));
  state.enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.STAR_FIGHTER));
  state.enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
  state.enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
  state.enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
  state.enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
  state.enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.TANK));
  state.enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.ARTILLERY));
  state.enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.TANK));
  state.enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.TANK));
  state.enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.DESTROYER));
  state.enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.SUB));
  state.enemy.fleet.addStruct(structBuilder.make(UNIT_TYPES.CRUISER));

  const ai = new AIPlanetMod(state);

  this.assertEquals(ai.countUnitType(UNIT_TYPES.STAR_FIGHTER, AMBITS.SPACE), 2);
  this.assertEquals(ai.countUnitType(UNIT_TYPES.FIGHTER_JET, AMBITS.SKY), 4);
  this.assertEquals(ai.countUnitType(UNIT_TYPES.TANK, AMBITS.LAND), 3);
  this.assertEquals(ai.countUnitType(UNIT_TYPES.SUB, AMBITS.WATER), 1);
  this.assertEquals(ai.countUnitType(UNIT_TYPES.SUB, AMBITS.SPACE), 0);
});

const placeGeneratorTest = new DTest('placeGeneratorTest', function(params) {
  const structBuilder = new StructBuilder();
  const enemy = new Player('Enemy');
  const state = new GameState();
  state.enemy = enemy;
  state.enemy.planet = new Planet(state.enemy.id);

  params.unitsToAdd.forEach(unitType => {
    state.enemy.fleet.addStruct(structBuilder.make(unitType));
  })

  const ai = new AIPlanetMod(state);
  ai.placeGenerator();

  this.assertEquals(state.enemy.planet[params.expectedAmbit.toLowerCase()][0].unitType, UNIT_TYPES.GENERATOR);
}, function() {
  return [
    {
      unitsToAdd: [],
      expectedAmbit: AMBITS.LAND
    },
    {
      unitsToAdd: [UNIT_TYPES.TANK],
      expectedAmbit: AMBITS.LAND
    },
    {
      unitsToAdd: [UNIT_TYPES.FIGHTER_JET],
      expectedAmbit: AMBITS.SKY
    },
    {
      unitsToAdd: [UNIT_TYPES.TANK, UNIT_TYPES.FIGHTER_JET],
      expectedAmbit: AMBITS.LAND
    },
    {
      unitsToAdd: [UNIT_TYPES.TANK, UNIT_TYPES.FIGHTER_JET, UNIT_TYPES.FIGHTER_JET],
      expectedAmbit: AMBITS.SKY
    },
    {
      unitsToAdd: [UNIT_TYPES.TANK, UNIT_TYPES.TANK, UNIT_TYPES.FIGHTER_JET],
      expectedAmbit: AMBITS.LAND
    },
    {
      unitsToAdd: [UNIT_TYPES.SUB, UNIT_TYPES.ARTILLERY, UNIT_TYPES.FIGHTER_JET, UNIT_TYPES.STAR_FIGHTER],
      expectedAmbit: AMBITS.SKY
    },
  ];
});

const getAttackGoalTest = new DTest('getAttackGoalTest', function() {
  const structBuilder = new StructBuilder();
  const player = new Player('Player');
  const enemy = new Player('Enemy');
  const state = new GameState();
  state.player = player;
  state.player.planet = new Planet(state.player.id);
  state.player.planet.addStruct(structBuilder.make(UNIT_TYPES.GENERATOR));
  state.player.commandStruct.operatingAmbit = AMBITS.SPACE;
  state.enemy = enemy;
  state.enemy.planet = new Planet(state.enemy.id);

  const ai = new AIPlanetMod(state);
  let goalStruct = ai.getAttackGoal();

  this.assertEquals(goalStruct.isCommandStruct(), true);

  state.arePlanetsEnabled = true;
  goalStruct = ai.getAttackGoal();

  this.assertEquals(goalStruct.isCommandStruct(), true);

  const starFighter = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
  state.player.fleet.addStruct(starFighter);
  starFighter.defend(state.player.commandStruct);
  goalStruct = ai.getAttackGoal();

  this.assertEquals(goalStruct.unitType, UNIT_TYPES.GENERATOR);

  goalStruct.destroyStruct();
  goalStruct = ai.getAttackGoal();

  this.assertEquals(goalStruct.isCommandStruct(), true);
});

const openingDefenseTest = new DTest('openingDefenseTest', function() {
  const state = getDummyStateWithPlanets();
  const ai = new AIPlanetMod(state);
  ai.openingDefense();

  this.assertEquals(state.enemy.fleet.space[0].defending.isCommandStruct(), true);
  this.assertEquals(state.enemy.fleet.space[1].defending.isCommandStruct(), true);
  this.assertEquals(state.enemy.fleet.space[2].defending.isCommandStruct(), true);
  this.assertEquals(state.enemy.fleet.space[3].defending.isCommandStruct(), true);
  this.assertEquals(state.enemy.fleet.land[0].defending.unitType, UNIT_TYPES.GENERATOR);
  this.assertEquals(state.enemy.fleet.land[1].defending.unitType, UNIT_TYPES.GENERATOR);
  this.assertEquals(state.enemy.fleet.land[2].defending.unitType, UNIT_TYPES.GENERATOR);
  this.assertEquals(state.enemy.fleet.land[3].defending.unitType, UNIT_TYPES.GENERATOR);
  this.assertEquals(state.enemy.commandStruct.defenders.length, 8);
  this.assertEquals(state.enemy.planet.land[0].defenders.length, 8);
});

const findAmbitForBestDefenseTest = new DTest('findAmbitForBestDefenseTest', function() {
  const state = getDummyStateWithPlanets();
  const ai = new AIPlanetMod(state);

  state.enemy.fleet.space[3].destroyStruct();
  state.enemy.fleet.sky[3].destroyStruct();
  state.enemy.fleet.land[3].destroyStruct();

  let ambit = ai.findAmbitForBestDefense(state.enemy);

  this.assertEquals(ambit, AMBITS.WATER);

  state.enemy.fleet.space[2].destroyStruct();
  state.enemy.fleet.sky[2].destroyStruct();
  state.enemy.fleet.sky[1].destroyStruct();
  state.enemy.fleet.water[3].destroyStruct();
  state.enemy.fleet.water[2].destroyStruct();
  state.enemy.fleet.water[1].destroyStruct();

  ambit = ai.findAmbitForBestDefense(state.enemy);

  this.assertEquals(ambit, AMBITS.SPACE);

  state.enemy.planet.land[0].destroyStruct();

  ambit = ai.findAmbitForBestDefense(state.enemy);

  this.assertEquals(ambit, AMBITS.LAND);
});

const defendVIPStructsWithUnusedTest = new DTest('defendVIPStructsWithUnusedTest', function() {
  const state = getDummyStateWithPlanets();
  const ai = new AIPlanetMod(state);

  state.enemy.fleet.space[0].defend(state.enemy.commandStruct);
  state.enemy.fleet.space[1].defend(state.enemy.commandStruct);
  state.enemy.fleet.space[2].defend(state.enemy.commandStruct);
  state.enemy.fleet.space[3].defend(state.enemy.commandStruct);
  state.enemy.fleet.sky[0].defend(state.enemy.commandStruct);
  state.enemy.fleet.sky[1].defend(state.enemy.commandStruct);

  ai.defendVIPStructsWithUnused();

  this.assertEquals(state.enemy.commandStruct.defenders.length, 8);
  this.assertEquals(state.enemy.planet.land[0].defenders.length, 8);
});

const findLowValueDefenderTest = new DTest('findLowValueDefenderTest', function() {
  const state = getDummyStateWithPlanets();
  const ai = new AIPlanetMod(state);

  state.enemy.fleet.land[0].defend(state.enemy.commandStruct);
  state.enemy.fleet.land[1].destroyStruct();
  state.enemy.fleet.land[2].defend(state.enemy.fleet.sky[0]);
  state.enemy.fleet.land[3].defend(state.enemy.planet.land[0]);

  const defender = ai.findLowValueDefender(AMBITS.LAND);

  this.assertEquals(defender.unitType, UNIT_TYPES.SAM_LAUNCHER);
});

const findExtraDefenderTest = new DTest('findExtraDefenderTest', function() {
  const state = getDummyStateWithPlanets();
  const ai = new AIPlanetMod(state);

  state.enemy.commandStruct.operatingAmbit = AMBITS.LAND;
  state.enemy.fleet.land[0].defend(state.enemy.commandStruct);
  state.enemy.fleet.land[1].destroyStruct();
  state.enemy.fleet.land[2].defend(state.enemy.fleet.sky[0]);
  state.enemy.fleet.land[3].defend(state.enemy.planet.land[0]);

  let defender = ai.findExtraDefender(AMBITS.LAND);

  this.assertEquals(defender, undefined);

  state.enemy.fleet.land[2].undefend();
  state.enemy.fleet.land[2].defend(state.enemy.commandStruct);

  defender = ai.findExtraDefender(AMBITS.LAND);

  this.assertEquals(defender.unitType, UNIT_TYPES.TANK);

  state.enemy.fleet.land[0].destroyStruct();
  state.enemy.fleet.land[2].destroyStruct();
  defender = ai.findExtraDefender(AMBITS.LAND);

  this.assertEquals(defender, undefined);

  defender = ai.findExtraDefender(AMBITS.LAND, true);

  this.assertEquals(defender.unitType, UNIT_TYPES.TANK);
});

const findStealableDefenderTest = new DTest('findStealableDefenderTest', function() {
  const state = getDummyStateWithPlanets();
  const ai = new AIPlanetMod(state);

  state.enemy.commandStruct.operatingAmbit = AMBITS.LAND;
  state.enemy.fleet.land[0].defend(state.enemy.commandStruct);
  state.enemy.fleet.land[1].defend(state.enemy.commandStruct)
  state.enemy.fleet.land[2].defend(state.enemy.fleet.sky[0]);
  state.enemy.fleet.land[3].destroyStruct();

  let defender = ai.findStealableDefender(AMBITS.LAND);

  this.assertEquals(defender.unitType, UNIT_TYPES.SAM_LAUNCHER);

  state.enemy.fleet.land[2].undefend();
  state.enemy.fleet.land[2].defend(state.enemy.planet.land[0]);

  defender = ai.findStealableDefender(AMBITS.LAND);

  this.assertEquals(defender.unitType, UNIT_TYPES.TANK);
});

const reviewBlockingDefendersTest = new DTest('reviewBlockingDefendersTest', function() {
  const state = getDummyStateWithPlanets();
  const ai = new AIPlanetMod(state);

  state.enemy.commandStruct.operatingAmbit = AMBITS.LAND;
  state.enemy.fleet.land[0].defend(state.enemy.commandStruct);
  state.enemy.fleet.land[1].defend(state.enemy.commandStruct)
  state.enemy.fleet.land[2].defend(state.enemy.commandStruct);
  state.enemy.fleet.land[3].defend(state.enemy.commandStruct);

  this.assertEquals(state.enemy.planet.land[0].countBlockingDefenders(), 0);

  ai.reviewBlockingDefenders(state.enemy.planet.land[0]);

  this.assertEquals(state.enemy.planet.land[0].countBlockingDefenders(), 1);
  this.assertEquals(state.enemy.commandStruct.countBlockingDefenders(), 3);

  ai.reviewBlockingDefenders(state.enemy.planet.land[0]);

  this.assertEquals(state.enemy.planet.land[0].countBlockingDefenders(), 1);
  this.assertEquals(state.enemy.commandStruct.countBlockingDefenders(), 3);
});

// Test execution
DTestSuite.printSuiteHeader('AIPlanetModTest');
countUnitTypeTest.run();
placeGeneratorTest.run();
getAttackGoalTest.run();
openingDefenseTest.run();
findAmbitForBestDefenseTest.run();
defendVIPStructsWithUnusedTest.run();
findLowValueDefenderTest.run();
findExtraDefenderTest.run();
findStealableDefenderTest.run();
reviewBlockingDefendersTest.run();
