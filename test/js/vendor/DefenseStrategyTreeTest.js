import {DTest} from "../../DTestFramework.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";
import {Player} from "../../../js/modules/Player.js";
import {UNIT_TYPES} from "../../../js/modules/Constants.js";
import {IdGenerator} from "../../../js/modules/util/IdGenerator.js";
import {DefenseStrategyTree} from "../../../js/modules/DefenseStrategyTree.js";

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

const generateTest = new DTest('generateTest', function() {
  const player = getDummyPlayer();
  setupPlayerDefensiveStrategy(player);
  const defenseStrategyTree = new DefenseStrategyTree();
  const treeRoot = defenseStrategyTree.generate(player.commandStruct);

  this.assertEquals(treeRoot.cost.space, 3);
  this.assertEquals(treeRoot.cost.sky, 0);
  this.assertEquals(treeRoot.cost.land, 0);
  this.assertEquals(treeRoot.cost.water, 0);
  this.assertEquals(treeRoot.costFromRoot.space, 0);
  this.assertEquals(treeRoot.costFromRoot.sky, 0);
  this.assertEquals(treeRoot.costFromRoot.land, 0);
  this.assertEquals(treeRoot.costFromRoot.water, 0);
  this.assertEquals(treeRoot.nodeChildren.length, 3);

  const starFighterNode = treeRoot.nodeChildren.find(
    childNode => childNode.struct.unitType === UNIT_TYPES.STAR_FIGHTER
  );
  this.assertEquals(starFighterNode.cost.space, 2);
  this.assertEquals(starFighterNode.cost.sky, 0);
  this.assertEquals(starFighterNode.cost.land, 0);
  this.assertEquals(starFighterNode.cost.water, 0);
  this.assertEquals(starFighterNode.costFromRoot.space, 3);
  this.assertEquals(starFighterNode.costFromRoot.sky, 0);
  this.assertEquals(starFighterNode.costFromRoot.land, 0);
  this.assertEquals(starFighterNode.costFromRoot.water, 0);
  this.assertEquals(starFighterNode.nodeChildren.length, 0);

  const spaceFrigateNode = treeRoot.nodeChildren.find(
    childNode => childNode.struct.unitType === UNIT_TYPES.SPACE_FRIGATE
  );
  this.assertEquals(spaceFrigateNode.cost.space, 2);
  this.assertEquals(spaceFrigateNode.cost.sky, 0);
  this.assertEquals(spaceFrigateNode.cost.land, 0);
  this.assertEquals(spaceFrigateNode.cost.water, 0);
  this.assertEquals(spaceFrigateNode.costFromRoot.space, 3);
  this.assertEquals(spaceFrigateNode.costFromRoot.sky, 0);
  this.assertEquals(spaceFrigateNode.costFromRoot.land, 0);
  this.assertEquals(spaceFrigateNode.costFromRoot.water, 0);
  this.assertEquals(spaceFrigateNode.nodeChildren.length, 1);
  this.assertEquals(spaceFrigateNode.nodeChildren[0].struct.unitType, UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR);
  this.assertEquals(spaceFrigateNode.nodeChildren[0].nodeChildren.length, 0);

  const galacticBattleshipNode = treeRoot.nodeChildren.find(
    childNode => childNode.struct.unitType === UNIT_TYPES.GALACTIC_BATTLESHIP
  );
  this.assertEquals(galacticBattleshipNode.cost.space, 2);
  this.assertEquals(galacticBattleshipNode.cost.sky, 0);
  this.assertEquals(galacticBattleshipNode.cost.land, 0);
  this.assertEquals(galacticBattleshipNode.cost.water, 0);
  this.assertEquals(galacticBattleshipNode.costFromRoot.space, 3);
  this.assertEquals(galacticBattleshipNode.costFromRoot.sky, 0);
  this.assertEquals(galacticBattleshipNode.costFromRoot.land, 0);
  this.assertEquals(galacticBattleshipNode.costFromRoot.water, 0);
  this.assertEquals(galacticBattleshipNode.nodeChildren.length, 1);

  const samLauncherNode = galacticBattleshipNode.nodeChildren[0];
  this.assertEquals(samLauncherNode.cost.space, 0);
  this.assertEquals(samLauncherNode.cost.sky, 0);
  this.assertEquals(samLauncherNode.cost.land, 2);
  this.assertEquals(samLauncherNode.cost.water, 0);
  this.assertEquals(samLauncherNode.costFromRoot.space, 5);
  this.assertEquals(samLauncherNode.costFromRoot.sky, 0);
  this.assertEquals(samLauncherNode.costFromRoot.land, 0);
  this.assertEquals(samLauncherNode.costFromRoot.water, 0);
  this.assertEquals(samLauncherNode.struct.unitType, UNIT_TYPES.SAM_LAUNCHER);
  this.assertEquals(samLauncherNode.nodeChildren.length, 2);

  const tankNode = samLauncherNode.nodeChildren.find(
    childNode => childNode.struct.unitType === UNIT_TYPES.TANK
  );
  this.assertEquals(tankNode.cost.space, 0);
  this.assertEquals(tankNode.cost.sky, 0);
  this.assertEquals(tankNode.cost.land, 2);
  this.assertEquals(tankNode.cost.water, 0);
  this.assertEquals(tankNode.costFromRoot.space, 5);
  this.assertEquals(tankNode.costFromRoot.sky, 0);
  this.assertEquals(tankNode.costFromRoot.land, 2);
  this.assertEquals(tankNode.costFromRoot.water, 0);
  this.assertEquals(tankNode.nodeChildren.length, 0);

  const cruiserNode = samLauncherNode.nodeChildren.find(
    childNode => childNode.struct.unitType === UNIT_TYPES.CRUISER
  );
  this.assertEquals(cruiserNode.cost.space, 0);
  this.assertEquals(cruiserNode.cost.sky, 0);
  this.assertEquals(cruiserNode.cost.land, 0);
  this.assertEquals(cruiserNode.cost.water, 2);
  this.assertEquals(cruiserNode.costFromRoot.space, 5);
  this.assertEquals(cruiserNode.costFromRoot.sky, 0);
  this.assertEquals(cruiserNode.costFromRoot.land, 2);
  this.assertEquals(cruiserNode.costFromRoot.water, 0);
  this.assertEquals(cruiserNode.nodeChildren.length, 0);
});

// Test execution
console.log('DefenseStrategyTreeTest');
generateTest.run();
