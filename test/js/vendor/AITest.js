import {DTest} from "../../DTestFramework.js";
import {DefenseStrategyTreeNode} from "../../../js/modules/data_structures/DefenseStrategyTreeNode.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";
import {UNIT_TYPES} from "../../../js/modules/Constants.js";
import {AmbitDistribution} from "../../../js/modules/AmbitDistribution.js";
import {AI} from "../../../js/modules/AI.js";
import {GameState} from "../../../js/modules/state/GameState.js";
import {IdGenerator} from "../../../js/modules/util/IdGenerator.js";
import {Player} from "../../../js/modules/Player.js";
import {CommandStructBuilder} from "../../../js/modules/CommandStructBuilder.js";

/**
 * @return {Player}
 */
function getDummyPlayer() {
  const idGenerator = new IdGenerator();
  const player = new Player(idGenerator.generate('Player-'));
  const structBuilder = new StructBuilder();

  player.fleet.addStruct(structBuilder.make(UNIT_TYPES.STAR_FIGHTER));
  player.fleet.addStruct(structBuilder.make(UNIT_TYPES.SPACE_FRIGATE));
  player.fleet.addStruct(structBuilder.make(UNIT_TYPES.GALACTIC_BATTLESHIP));
  player.fleet.addStruct(structBuilder.make(UNIT_TYPES.STAR_FIGHTER));
  player.fleet.addStruct(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
  player.fleet.addStruct(structBuilder.make(UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR));
  player.fleet.addStruct(structBuilder.make(UNIT_TYPES.STEALTH_BOMBER));
  player.fleet.addStruct(structBuilder.make(UNIT_TYPES.FIGHTER_JET));
  player.fleet.addStruct(structBuilder.make(UNIT_TYPES.TANK));
  player.fleet.addStruct(structBuilder.make(UNIT_TYPES.ARTILLERY));
  player.fleet.addStruct(structBuilder.make(UNIT_TYPES.SAM_LAUNCHER));
  player.fleet.addStruct(structBuilder.make(UNIT_TYPES.TANK));
  player.fleet.addStruct(structBuilder.make(UNIT_TYPES.SUB));
  player.fleet.addStruct(structBuilder.make(UNIT_TYPES.DESTROYER));
  player.fleet.addStruct(structBuilder.make(UNIT_TYPES.CRUISER));
  player.fleet.addStruct(structBuilder.make(UNIT_TYPES.SUB));

  return player;
}

/**
 * @param {Player} dummyPlayer
 */
function setupPlayerDefensiveStrategy(dummyPlayer) {
  dummyPlayer.fleet.space[0].defend(dummyPlayer.commandStruct); // Star Fighter 1
  dummyPlayer.fleet.space[1].defend(dummyPlayer.commandStruct); // Space Frigate
  dummyPlayer.fleet.sky[1].defend(dummyPlayer.fleet.space[1]); // High Altitude Interceptor
  dummyPlayer.fleet.space[2].defend(dummyPlayer.commandStruct); // Galactic Battleship
  dummyPlayer.fleet.land[2].defend(dummyPlayer.fleet.space[2]); // SAM
  dummyPlayer.fleet.land[0].defend(dummyPlayer.fleet.land[2]); // TANK 1
  dummyPlayer.fleet.water[2].defend(dummyPlayer.fleet.land[2]); // Cruiser
}

const rankTargetTest = new DTest('rankTargetTest', function() {
  const ai = new AI(new GameState());
  const structBuilder = new StructBuilder();
  const struct1 = structBuilder.make(UNIT_TYPES.TANK);
  const struct2 = structBuilder.make(UNIT_TYPES.TANK);
  const node1 = new DefenseStrategyTreeNode(struct1.id, struct1, new AmbitDistribution());
  const node2 = new DefenseStrategyTreeNode(struct2.id, struct2, new AmbitDistribution());

  // No cost and no variance
  this.assertEquals(ai.rankTarget(node1), 0);

  node1.costFromRoot.space = 2;
  node1.costFromRoot.sky = 2;
  node1.costFromRoot.land = 2;
  node1.costFromRoot.water = 2;
  node1.cost.space = 0;
  node1.cost.sky = 0;
  node1.cost.land = 2;
  node1.cost.water = 0;

  node2.costFromRoot.space = 8;
  node2.costFromRoot.sky = 0;
  node2.costFromRoot.land = 0;
  node2.costFromRoot.water = 0;
  node2.cost.space = 0;
  node2.cost.sky = 0;
  node2.cost.land = 2;
  node2.cost.water = 0;

  // Same cost but different variance
  this.assertEquals(ai.rankTarget(node1) < ai.rankTarget(node2), true);

  node1.costFromRoot.space = 3;
  node1.costFromRoot.sky = 3;
  node1.costFromRoot.land = 1;
  node1.costFromRoot.water = 3;
  node1.cost.space = 0;
  node1.cost.sky = 0;
  node1.cost.land = 2;
  node1.cost.water = 0;

  node2.costFromRoot.space = 2;
  node2.costFromRoot.sky = 2;
  node2.costFromRoot.land = 0;
  node2.costFromRoot.water = 2;
  node2.cost.space = 0;
  node2.cost.sky = 0;
  node2.cost.land = 2;
  node2.cost.water = 0;

  // Same variance but less cost
  this.assertEquals(ai.rankTarget(node2) < ai.rankTarget(node1), true);

  node1.costFromRoot.space = 3;
  node1.costFromRoot.sky = 3;
  node1.costFromRoot.land = 3;
  node1.costFromRoot.water = 3;
  node1.cost.space = 0;
  node1.cost.sky = 0;
  node1.cost.land = 2;
  node1.cost.water = 0;

  node2.costFromRoot.space = 3;
  node2.costFromRoot.sky = 1;
  node2.costFromRoot.land = 3;
  node2.costFromRoot.water = 0;
  node2.cost.space = 0;
  node2.cost.sky = 0;
  node2.cost.land = 2;
  node2.cost.water = 0;

  // More variance but less cost
  this.assertEquals(ai.rankTarget(node2) < ai.rankTarget(node1), true);
});

const determineTargetTest = new DTest('determineTargetTest', function() {
  const player = getDummyPlayer();
  setupPlayerDefensiveStrategy(player);
  const state = new GameState();
  state.player = player;
  const ai = new AI(state);
  let target = ai.determineTarget();

  this.assertEquals(target.unitType, UNIT_TYPES.STAR_FIGHTER);

  const starFighter = state.player.fleet.space.find(struct => struct && struct.unitType === UNIT_TYPES.STAR_FIGHTER);
  starFighter.destroyStruct();

  target = ai.determineTarget();

  this.assertEquals(target.unitType, UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR);

  const spaceFrigate = state.player.fleet.space.find(struct => struct && struct.unitType === UNIT_TYPES.SPACE_FRIGATE);
  spaceFrigate.destroyStruct();

  target = ai.determineTarget();

  this.assertEquals(target.unitType, UNIT_TYPES.CRUISER);

  target.destroyStruct();
  target = ai.determineTarget();

  this.assertEquals(target.unitType, UNIT_TYPES.TANK);

  target.destroyStruct();
  target = ai.determineTarget();

  this.assertEquals(target.unitType, UNIT_TYPES.SAM_LAUNCHER);

  target.destroyStruct();
  target = ai.determineTarget();

  this.assertEquals(target.unitType, UNIT_TYPES.GALACTIC_BATTLESHIP);

  target.destroyStruct();
  target = ai.determineTarget();

  this.assertEquals(target.isCommandStruct(), true);
});

const getUncounterableAttackScoreTest = new DTest('getUncounterableAttackScoreTest', function() {
  const structBuilder = new StructBuilder();
  const stealthBomber = structBuilder.make(UNIT_TYPES.STEALTH_BOMBER);
  const tank = structBuilder.make(UNIT_TYPES.TANK);
  const artillery = structBuilder.make(UNIT_TYPES.ARTILLERY);
  const starFighter1 = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
  const starFighter2 = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
  const ai = new AI(new GameState());

  this.assertEquals(ai.getUncounterableAttackScore(stealthBomber, tank), Infinity);
  this.assertEquals(ai.getUncounterableAttackScore(artillery, tank), Infinity);
  this.assertEquals(ai.getUncounterableAttackScore(tank, artillery), Infinity);
  this.assertEquals(ai.getUncounterableAttackScore(starFighter1, starFighter2), 0);
});

const getBlockingCommandShipAttackScoreTest = new DTest('getBlockingCommandShipAttackScoreTest', function() {
  const structBuilder = new StructBuilder();
  const commandStructBuilder = new CommandStructBuilder();
  const ai = new AI(new GameState());

  const tank = structBuilder.make(UNIT_TYPES.TANK);
  const commandShip = commandStructBuilder.make(UNIT_TYPES.COMMAND_SHIP);
  const starFighter = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
  const sub = structBuilder.make(UNIT_TYPES.SUB);

  starFighter.defend(commandShip);
  sub.defend(commandShip);

  this.assertEquals(ai.getBlockingCommandShipAttackScore(tank), 1);
  this.assertEquals(ai.getBlockingCommandShipAttackScore(starFighter), 0);
  this.assertEquals(ai.getBlockingCommandShipAttackScore(sub), 1);
});

const getCurrentHealthAttackScoreTest = new DTest('getCurrentHealthAttackScoreTest', function() {
  const structBuilder = new StructBuilder();
  const commandStructBuilder = new CommandStructBuilder();
  const ai = new AI(new GameState());

  const commandShip = commandStructBuilder.make(UNIT_TYPES.COMMAND_SHIP);
  const tank1 = structBuilder.make(UNIT_TYPES.TANK);
  const tank2 = structBuilder.make(UNIT_TYPES.TANK);

  this.assertEquals(ai.getCurrentHealthAttackScore(tank1, tank2), 2);
  this.assertEquals(ai.getCurrentHealthAttackScore(tank1, commandShip), 2);

  tank1.currentHealth = 2;

  this.assertEquals(ai.getCurrentHealthAttackScore(tank1, tank2), 1);
  this.assertEquals(ai.getCurrentHealthAttackScore(tank1, commandShip), 0);

  tank1.currentHealth = 1;

  this.assertEquals(ai.getCurrentHealthAttackScore(tank1, tank2), 0);
  this.assertEquals(ai.getCurrentHealthAttackScore(tank1, commandShip), 1);
});

const getAmbitTargetingCostAttackScoreTest = new DTest('getAmbitTargetingCostAttackScoreTest', function() {
  const structBuilder = new StructBuilder();
  const starFighter = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
  const spaceFrigate = structBuilder.make(UNIT_TYPES.SPACE_FRIGATE);
  const galacticBattleship = structBuilder.make(UNIT_TYPES.GALACTIC_BATTLESHIP);
  const ai = new AI(new GameState());

  this.assertEquals(ai.getAmbitTargetingCostAttackScore(starFighter), 3);
  this.assertEquals(ai.getAmbitTargetingCostAttackScore(spaceFrigate), 2);
  this.assertEquals(ai.getAmbitTargetingCostAttackScore(galacticBattleship), 1);
});

// Test execution
console.log('AITest');
rankTargetTest.run();
determineTargetTest.run();
getUncounterableAttackScoreTest.run();
getBlockingCommandShipAttackScoreTest.run();
getCurrentHealthAttackScoreTest.run();
getAmbitTargetingCostAttackScoreTest.run();
