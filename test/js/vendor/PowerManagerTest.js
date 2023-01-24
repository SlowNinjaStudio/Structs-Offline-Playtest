import {DTest} from "../../DTestFramework.js";
import {AMBITS, POWER_GENERATORS, UNIT_TYPES} from "../../../js/modules/Constants.js";
import {PowerManager} from "../../../js/modules/PowerManager.js";
import {Player} from "../../../js/modules/Player.js";
import {GameState} from "../../../js/modules/state/GameState.js";
import {Planet} from "../../../js/modules/Planet.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";

const managePowerPerRoundTest = new DTest('managePowerPerRoundTest', function() {
  const player = new Player('Player');
  const enemy = new Player('Enemy');

  const state = new GameState();
  state.player = player;
  state.enemy = enemy;
  state.player.creditManager.credits = 0;
  state.enemy.creditManager.credits = 0;

  let manager = new PowerManager(state);
  manager.managePowerPerRound();

  this.assertEquals(state.player.creditManager.credits, 0);
  this.assertEquals(state.enemy.creditManager.credits, 0);

  state.arePlanetsEnabled = true;
  state.player.planet = new Planet(state.player.id);
  state.enemy.planet = new Planet(state.enemy.id);

  manager = new PowerManager(state);
  manager.managePowerPerRound();

  this.assertEquals(state.player.creditManager.credits, 0);
  this.assertEquals(state.enemy.creditManager.credits, 0);

  const builder = new StructBuilder();
  const generator1 = builder.make(UNIT_TYPES.GENERATOR);
  generator1.operatingAmbit = AMBITS.LAND;
  const generator2 = builder.make(UNIT_TYPES.GENERATOR);
  generator2.operatingAmbit = AMBITS.SKY;
  const generator3 = builder.make(UNIT_TYPES.GENERATOR);
  generator3.operatingAmbit = AMBITS.WATER;

  this.assertEquals(state.player.planet.addStruct(generator1), true);
  this.assertEquals(state.enemy.planet.addStruct(generator2), true);

  manager = new PowerManager(state);
  manager.managePowerPerRound();

  this.assertEquals(state.player.creditManager.credits, 0);
  this.assertEquals(state.enemy.creditManager.credits, 0);

  state.numTurns = 5;

  manager = new PowerManager(state);
  manager.managePowerPerRound();

  this.assertEquals(state.player.creditManager.credits, POWER_GENERATORS.GENERIC.POWER_OUTPUT);
  this.assertEquals(state.enemy.creditManager.credits, POWER_GENERATORS.GENERIC.POWER_OUTPUT);

  manager.managePowerPerRound();

  this.assertEquals(state.player.creditManager.credits, POWER_GENERATORS.GENERIC.POWER_OUTPUT * 2);
  this.assertEquals(state.enemy.creditManager.credits, POWER_GENERATORS.GENERIC.POWER_OUTPUT * 2);

  manager.wattCap = POWER_GENERATORS.GENERIC.POWER_OUTPUT * 4;
  state.player.creditManager.addCredits(POWER_GENERATORS.GENERIC.POWER_OUTPUT);
  manager.managePowerPerRound();

  this.assertEquals(state.player.creditManager.credits, POWER_GENERATORS.GENERIC.POWER_OUTPUT * 4);
  this.assertEquals(state.enemy.creditManager.credits, POWER_GENERATORS.GENERIC.POWER_OUTPUT * 3);

  manager.managePowerPerRound();

  this.assertEquals(state.player.creditManager.credits, POWER_GENERATORS.GENERIC.POWER_OUTPUT * 4);
  this.assertEquals(state.enemy.creditManager.credits, POWER_GENERATORS.GENERIC.POWER_OUTPUT * 4);
});

// Test execution
console.log('PowerManagerTest');
managePowerPerRoundTest.run();
