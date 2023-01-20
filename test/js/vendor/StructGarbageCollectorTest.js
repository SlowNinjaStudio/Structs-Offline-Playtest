import {DTest} from "../../DTestFramework.js";
import {Player} from "../../../js/modules/Player.js";
import {GameState} from "../../../js/modules/state/GameState.js";
import {FleetGenerator} from "../../../js/modules/FleetGenerator.js";
import {StructGarbageCollector} from "../../../js/modules/StructGarbageCollector.js";

const cleanUpTest = new DTest('cleanUpTest', function() {
  const player = new Player('Player');
  const enemy = new Player('Enemy');
  const state = new GameState();
  const fleetGenerator = new FleetGenerator();
  const garbageCollector = new StructGarbageCollector(state);

  state.player = player;
  state.enemy = enemy;
  state.numTurns = 3;
  fleetGenerator.generateCuratedFleet(state.player.fleet);
  fleetGenerator.generateCuratedFleet(state.enemy.fleet);

  this.assertEquals(state.player.fleet.numberOfStructs(), 16);
  this.assertEquals(state.enemy.fleet.numberOfStructs(), 16);

  garbageCollector.cleanUp();

  this.assertEquals(state.player.fleet.numberOfStructs(), 16);
  this.assertEquals(state.enemy.fleet.numberOfStructs(), 16);

  state.player.fleet.sky[0].destroyStruct();
  state.player.fleet.land[1].destroyStruct();
  state.player.fleet.water[2].destroyStruct();
  state.enemy.fleet.space[3].destroyStruct();

  garbageCollector.cleanUp();

  this.assertEquals(state.player.fleet.numberOfStructs(), 16);
  this.assertEquals(state.enemy.fleet.numberOfStructs(), 16);

  state.numTurns += 2;
  garbageCollector.cleanUp();

  this.assertEquals(state.player.fleet.numberOfStructs(), 13);
  this.assertEquals(state.enemy.fleet.numberOfStructs(), 15);
});

// Test execution
console.log('StructGarbageCollectorTest');
cleanUpTest.run();
