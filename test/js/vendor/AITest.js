import {DTest, DTestSuite} from "../../DTestFramework.js";
import {DefenseStrategyTreeNode} from "../../../js/modules/data_structures/DefenseStrategyTreeNode.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";
import {
  AMBITS,
  COMMAND_STRUCT_DEFAULTS,
  EVENTS,
  MANUAL_WEAPON_SLOTS,
  UNIT_TYPES
} from "../../../js/modules/Constants.js";
import {AmbitDistribution} from "../../../js/modules/AmbitDistribution.js";
import {AI} from "../../../js/modules/AI.js";
import {GameState} from "../../../js/modules/state/GameState.js";
import {IdGenerator} from "../../../js/modules/util/IdGenerator.js";
import {Player} from "../../../js/modules/Player.js";
import {CommandStructBuilder} from "../../../js/modules/CommandStructBuilder.js";
import {CombatEventLogItem} from "../../../js/modules/CombatEventLogItem.js";
import {CombatEvent} from "../../../js/modules/CombatEvent.js";
import {AIThreatDTO} from "../../../js/modules/dtos/AIThreatDTO.js";
import {AIAttackParamsDTO} from "../../../js/modules/dtos/AIAttackParamsDTO.js";
import {Fleet} from "../../../js/modules/Fleet.js";

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

/**
 * @param {Fleet} fleet
 */
function destroySelectStructs(fleet) {
  // space[0] = Star Fighter 1, space
  // space[1] = Space Frigate, space and sky
  fleet.space[2].destroyStruct();
  fleet.space[3].destroyStruct();
  fleet.sky[0].destroyStruct();
  // sky[1] = High Altitude Interceptor, space and sky
  fleet.sky[2].destroyStruct();
  fleet.sky[3].destroyStruct();
  fleet.land[0].destroyStruct();
  fleet.land[1].destroyStruct();
  // land[2] = SAM, space and sky
  fleet.land[3].destroyStruct();
  // water[0] = SUB, water, space
  fleet.water[1].destroyStruct();
  fleet.water[2].destroyStruct();
  fleet.water[3].destroyStruct();
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

const determineTargetOnGoalTest = new DTest('determineTargetOnGoalTest', function() {
  const player = getDummyPlayer();
  setupPlayerDefensiveStrategy(player);
  const state = new GameState();
  state.player = player;
  const ai = new AI(state);
  let target = ai.determineTargetOnGoal();

  this.assertEquals(target.unitType, UNIT_TYPES.STAR_FIGHTER);

  const starFighter = state.player.fleet.space.find(struct => struct && struct.unitType === UNIT_TYPES.STAR_FIGHTER);
  starFighter.destroyStruct();

  target = ai.determineTargetOnGoal();

  this.assertEquals(target.unitType, UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR);

  const spaceFrigate = state.player.fleet.space.find(struct => struct && struct.unitType === UNIT_TYPES.SPACE_FRIGATE);
  spaceFrigate.destroyStruct();

  target = ai.determineTargetOnGoal();

  this.assertEquals(target.unitType, UNIT_TYPES.CRUISER);

  target.destroyStruct();
  target = ai.determineTargetOnGoal();

  this.assertEquals(target.unitType, UNIT_TYPES.TANK);

  target.destroyStruct();
  target = ai.determineTargetOnGoal();

  this.assertEquals(target.unitType, UNIT_TYPES.SAM_LAUNCHER);

  target.destroyStruct();
  target = ai.determineTargetOnGoal();

  this.assertEquals(target.unitType, UNIT_TYPES.GALACTIC_BATTLESHIP);

  target.destroyStruct();
  target = ai.determineTargetOnGoal();

  this.assertEquals(target.isCommandStruct(), true);
});

const getUncounterableByTargetAttackScoreTest = new DTest('getUncounterableAttackScoreTest', function() {
  const structBuilder = new StructBuilder();
  const stealthBomber = structBuilder.make(UNIT_TYPES.STEALTH_BOMBER);
  const tank = structBuilder.make(UNIT_TYPES.TANK);
  const artillery = structBuilder.make(UNIT_TYPES.ARTILLERY);
  const starFighter1 = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
  const starFighter2 = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
  const ai = new AI(new GameState());

  this.assertEquals(ai.getUncounterableByTargetAttackScore(stealthBomber, tank), 10);
  this.assertEquals(ai.getUncounterableByTargetAttackScore(artillery, tank), 10);
  this.assertEquals(ai.getUncounterableByTargetAttackScore(tank, artillery), 10);
  this.assertEquals(ai.getUncounterableByTargetAttackScore(starFighter1, starFighter2), 0);
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

const getUncounterableByDefendersAttackScoreTest = new DTest('getUncounterableByDefendersAttackScoreTest', function() {
  const structBuilder = new StructBuilder();
  const stealthBomber = structBuilder.make(UNIT_TYPES.STEALTH_BOMBER);
  const tank = structBuilder.make(UNIT_TYPES.TANK);
  const samLauncher = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
  const artillery = structBuilder.make(UNIT_TYPES.ARTILLERY);
  const sub = structBuilder.make(UNIT_TYPES.SUB);
  const galacticBattleship = structBuilder.make(UNIT_TYPES.GALACTIC_BATTLESHIP);
  const ai = new AI(new GameState());

  this.assertEquals(ai.getUncounterableByDefendersAttackScore(stealthBomber, tank), 0);

  tank.defend(samLauncher);

  this.assertEquals(ai.getUncounterableByDefendersAttackScore(artillery, samLauncher), 5);

  sub.defend(tank);

  this.assertEquals(ai.getUncounterableByDefendersAttackScore(galacticBattleship, tank), 0);
});

const getCanBeatCounterMeasuresAttackScoreTest = new DTest('getCanBeatCounterMeasuresAttackScoreTest', function() {
  const structBuilder = new StructBuilder();
  const stealthBomber = structBuilder.make(UNIT_TYPES.STEALTH_BOMBER);
  const tank = structBuilder.make(UNIT_TYPES.TANK);
  const samLauncher = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
  const spaceFrigate = structBuilder.make(UNIT_TYPES.SPACE_FRIGATE);
  const galacticBattleship = structBuilder.make(UNIT_TYPES.GALACTIC_BATTLESHIP);
  const fighterJet = structBuilder.make(UNIT_TYPES.FIGHTER_JET);
  const cruiser = structBuilder.make(UNIT_TYPES.CRUISER);
  const starFighter = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
  const ai = new AI(new GameState());

  this.assertEquals(ai.getCanBeatCounterMeasuresAttackScore(cruiser, fighterJet), 15);
  this.assertEquals(ai.getCanBeatCounterMeasuresAttackScore(samLauncher, fighterJet), 0);
  this.assertEquals(ai.getCanBeatCounterMeasuresAttackScore(stealthBomber, tank), 15);
  this.assertEquals(ai.getCanBeatCounterMeasuresAttackScore(starFighter, galacticBattleship), 15);
  this.assertEquals(ai.getUncounterableByDefendersAttackScore(spaceFrigate, galacticBattleship), 0);
});

const getStructAttackScoreTest = new DTest('getStructAttackScoreTest', function() {
  const structBuilder = new StructBuilder();
  const commandStructBuilder = new CommandStructBuilder();
  const ai = new AI(new GameState());

  const commandShip1 = commandStructBuilder.make(UNIT_TYPES.COMMAND_SHIP);
  const commandShip2 = commandStructBuilder.make(UNIT_TYPES.COMMAND_SHIP);
  commandShip1.operatingAmbit = AMBITS.WATER;
  commandShip2.operatingAmbit = AMBITS.WATER;
  const starFighter = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
  const sub = structBuilder.make(UNIT_TYPES.SUB);
  sub.defend(commandShip2);
  const artillery = structBuilder.make(UNIT_TYPES.ARTILLERY);
  const stealthBomber = structBuilder.make(UNIT_TYPES.STEALTH_BOMBER);
  const spaceFrigate = structBuilder.make(UNIT_TYPES.SPACE_FRIGATE);
  const samLauncher = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
  const fighterJet = structBuilder.make(UNIT_TYPES.FIGHTER_JET);
  const galacticBattleship = structBuilder.make(UNIT_TYPES.GALACTIC_BATTLESHIP);
  const tank = structBuilder.make(UNIT_TYPES.TANK);
  tank.defend(sub);


  this.assertEquals(ai.getStructAttackScore(starFighter, commandShip1), -1);
  this.assertEquals(ai.getStructAttackScore(commandShip1, commandShip2), 0);
  this.assertEquals(ai.getStructAttackScore(sub, commandShip1), 19);
  this.assertEquals(ai.getStructAttackScore(artillery, commandShip1), 30);
  this.assertEquals(ai.getStructAttackScore(stealthBomber, commandShip1), 30);
  this.assertEquals(ai.getStructAttackScore(artillery, sub), 35);
  this.assertEquals(ai.getStructAttackScore(starFighter, spaceFrigate), 21);
  this.assertEquals(ai.getStructAttackScore(starFighter, galacticBattleship), 21);
  this.assertEquals(ai.getStructAttackScore(spaceFrigate, galacticBattleship), 5);

  starFighter.destroyStruct();

  this.assertEquals(ai.getStructAttackScore(starFighter, spaceFrigate), -1);

  this.assertEquals(ai.getStructAttackScore(samLauncher, stealthBomber), 20);

  stealthBomber.defenseComponent.isActive = true;

  this.assertEquals(ai.getStructAttackScore(samLauncher, stealthBomber), -1);
  this.assertEquals(ai.getStructAttackScore(fighterJet, stealthBomber), 31);
});

const chooseAttackStructTest = new DTest('chooseAttackStructTest', function(params) {
  const gameState = new GameState();
  gameState.player = getDummyPlayer();
  gameState.enemy = getDummyPlayer();
  const target = gameState.player.fleet[params.targetAmbit].find(struct => struct.unitType === params.targetUnitType);
  const ai = new AI(gameState);

  this.assertEquals(params.expectedUnitTypes.includes((ai.chooseAttackStruct(target)).struct.unitType), true);
}, function() {
  return [
    {
      targetAmbit: 'space',
      targetUnitType: UNIT_TYPES.STAR_FIGHTER,
      expectedUnitTypes: [
        UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
        UNIT_TYPES.SAM_LAUNCHER,
        UNIT_TYPES.SUB
      ]
    },
    {
      targetAmbit: 'space',
      targetUnitType: UNIT_TYPES.SPACE_FRIGATE,
      expectedUnitTypes: [
        UNIT_TYPES.SAM_LAUNCHER,
        UNIT_TYPES.SUB
      ]
    },
    {
      targetAmbit: 'space',
      targetUnitType: UNIT_TYPES.GALACTIC_BATTLESHIP,
      expectedUnitTypes: [
        UNIT_TYPES.STAR_FIGHTER,
        UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR
      ]
    },
    {
      targetAmbit: 'sky',
      targetUnitType: UNIT_TYPES.FIGHTER_JET,
      expectedUnitTypes: [
        UNIT_TYPES.SPACE_FRIGATE,
        UNIT_TYPES.SAM_LAUNCHER,
        UNIT_TYPES.DESTROYER,
        UNIT_TYPES.CRUISER,
      ]
    },
    {
      targetAmbit: 'sky',
      targetUnitType: UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
      expectedUnitTypes: [
        UNIT_TYPES.SAM_LAUNCHER,
        UNIT_TYPES.DESTROYER,
        UNIT_TYPES.CRUISER,
      ]
    },
    {
      targetAmbit: 'sky',
      targetUnitType: UNIT_TYPES.STEALTH_BOMBER,
      expectedUnitTypes: [
        UNIT_TYPES.SPACE_FRIGATE,
        UNIT_TYPES.FIGHTER_JET,
        UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
      ]
    },
    {
      targetAmbit: 'land',
      targetUnitType: UNIT_TYPES.TANK,
      expectedUnitTypes: [
        UNIT_TYPES.GALACTIC_BATTLESHIP,
        UNIT_TYPES.STEALTH_BOMBER,
        UNIT_TYPES.ARTILLERY,
        UNIT_TYPES.CRUISER,
      ]
    },
    {
      targetAmbit: 'land',
      targetUnitType: UNIT_TYPES.ARTILLERY,
      expectedUnitTypes: [
        UNIT_TYPES.GALACTIC_BATTLESHIP,
        UNIT_TYPES.STEALTH_BOMBER,
        UNIT_TYPES.TANK,
        UNIT_TYPES.ARTILLERY,
        UNIT_TYPES.CRUISER,
      ]
    },
    {
      targetAmbit: 'land',
      targetUnitType: UNIT_TYPES.SAM_LAUNCHER,
      expectedUnitTypes: [
        UNIT_TYPES.TANK,
        UNIT_TYPES.ARTILLERY,
        UNIT_TYPES.CRUISER,
      ]
    },
    {
      targetAmbit: 'water',
      targetUnitType: UNIT_TYPES.SUB,
      expectedUnitTypes: [
        UNIT_TYPES.STEALTH_BOMBER,
        UNIT_TYPES.ARTILLERY
      ]
    },
    {
      targetAmbit: 'water',
      targetUnitType: UNIT_TYPES.DESTROYER,
      expectedUnitTypes: [
        UNIT_TYPES.GALACTIC_BATTLESHIP,
        UNIT_TYPES.ARTILLERY,
      ]
    },
    {
      targetAmbit: 'water',
      targetUnitType: UNIT_TYPES.CRUISER,
      expectedUnitTypes: [
        UNIT_TYPES.GALACTIC_BATTLESHIP,
        UNIT_TYPES.ARTILLERY,
      ]
    },
  ];
});

const attackTest = new DTest('attackTest', function() {
  const player = getDummyPlayer();
  const playerSpaceFrigate = player.fleet.space[1];
  playerSpaceFrigate.currentHealth = 2;
  playerSpaceFrigate.defend(player.commandStruct);
  const playerGalacticBattleship = player.fleet.space[2];
  playerGalacticBattleship.defend(player.commandStruct);

  const enemy = getDummyPlayer();
  const enemySub1 = enemy.fleet.water[0];
  const enemySub2 = enemy.fleet.water[3];
  enemySub1.defend(enemy.commandStruct);
  enemySub2.defend(enemy.commandStruct);

  const state = new GameState();
  state.player = player;
  state.enemy = enemy;
  const ai = new AI(state);

  this.assertEquals(playerSpaceFrigate.currentHealth, 2);
  this.assertEquals(playerSpaceFrigate.isDestroyed, false);

  let target = ai.chooseTarget();
  let attackParams = new AIAttackParamsDTO(target, (ai.chooseAttackStruct(target)).struct);
  let choice = ai.attack(attackParams);
  const enemySamLauncher = enemy.fleet.land[2];

  this.assertEquals(choice.targetStruct.unitType, playerSpaceFrigate.unitType);
  this.assertEquals(choice.attackStruct.unitType, enemySamLauncher.unitType);
  this.assertEquals(choice.weaponSlot, MANUAL_WEAPON_SLOTS.PRIMARY);

  this.assertEquals(playerSpaceFrigate.currentHealth, 0);
  this.assertEquals(playerSpaceFrigate.isDestroyed, true);
  this.assertEquals(playerGalacticBattleship.currentHealth, 3);

  const starFighter = enemy.fleet.space[0];
  attackParams.target = ai.chooseTarget();
  attackParams.attackingAIStruct = (ai.chooseAttackStruct(attackParams.target)).struct;
  choice = ai.attack(attackParams);

  this.assertEquals(choice.targetStruct.unitType, playerGalacticBattleship.unitType);
  this.assertEquals(choice.attackStruct.unitType, starFighter.unitType);
  this.assertEquals(choice.weaponSlot, MANUAL_WEAPON_SLOTS.SECONDARY);

  playerGalacticBattleship.destroyStruct();
  starFighter.destroyStruct();
  attackParams.target = ai.chooseTarget();
  attackParams.attackingAIStruct = (ai.chooseAttackStruct(attackParams.target)).struct;
  choice = ai.attack(attackParams);

  this.assertEquals(choice.targetStruct.id, player.commandStruct.id);
  this.assertEquals(choice.attackStruct.unitType, enemySamLauncher.unitType);
  this.assertEquals(choice.weaponSlot, MANUAL_WEAPON_SLOTS.PRIMARY);
  this.assertEquals(player.commandStruct.currentHealth, 4);

  attackParams.target = ai.chooseTarget();
  attackParams.attackingAIStruct = (ai.chooseAttackStruct(attackParams.target)).struct;
  choice = ai.attack(attackParams);

  this.assertEquals(choice.targetStruct.id, player.commandStruct.id);
  this.assertEquals(choice.attackStruct.unitType, enemySamLauncher.unitType);
  this.assertEquals(choice.weaponSlot, MANUAL_WEAPON_SLOTS.PRIMARY);
  this.assertEquals(player.commandStruct.currentHealth, 2);

  attackParams.target = ai.chooseTarget();
  attackParams.attackingAIStruct = (ai.chooseAttackStruct(attackParams.target)).struct;
  choice = ai.attack(attackParams);

  this.assertEquals(choice.targetStruct.id, player.commandStruct.id);
  this.assertEquals(choice.attackStruct.unitType, enemySamLauncher.unitType);
  this.assertEquals(choice.weaponSlot, MANUAL_WEAPON_SLOTS.PRIMARY);
  this.assertEquals(player.commandStruct.currentHealth, 0);
  this.assertEquals(player.commandStruct.isDestroyed, true);
});

const openingDefenseTest = new DTest('openingDefenseTest', function() {
  const player = getDummyPlayer();
  const enemy = getDummyPlayer();
  const state = new GameState();
  state.player = player;
  state.enemy = enemy;
  const ai = new AI(state);

  ai.openingDefense();

  state.player.fleet.forEachStruct(struct => {
    this.assertEquals(!!struct.defending, false);
  });

  state.enemy.fleet.forEachStruct(struct => {
    this.assertEquals(struct.defending.id, state.enemy.commandStruct.id);
  });
});

const findFleetTargetingWeaknessTest = new DTest('findFleetTargetingWeaknessTest', function() {
  const player = getDummyPlayer();
  const enemy = getDummyPlayer();
  const state = new GameState();
  state.player = player;
  state.enemy = enemy;
  const ai = new AI(state);

  let ambitWeakness = ai.findFleetTargetingWeakness(state.player.fleet);

  this.assertEquals(ambitWeakness, null);

  destroySelectStructs(state.player.fleet);

  ambitWeakness = ai.findFleetTargetingWeakness(state.player.fleet);

  this.assertEquals(ambitWeakness, AMBITS.LAND);
});

const findAmbitForBestDefenseTest = new DTest('findAmbitForBestDefenseTest', function() {
  const player = getDummyPlayer();
  const enemy = getDummyPlayer();
  const state = new GameState();
  state.player = player;
  state.enemy = enemy;
  const ai = new AI(state);

  let mostOccupiedAmbit = ai.findAmbitForBestDefense(state.enemy);

  this.assertEquals(mostOccupiedAmbit, AMBITS.WATER);

  destroySelectStructs(state.enemy.fleet);

  mostOccupiedAmbit = ai.findAmbitForBestDefense(state.enemy);

  this.assertEquals(mostOccupiedAmbit, AMBITS.SPACE);
});

const canAttackIfHiddenTest = new DTest('canAttackIfHiddenTest', function() {
  const gameState = new GameState();
  gameState.player = getDummyPlayer();
  gameState.enemy = getDummyPlayer();
  const ai = new AI(gameState);

  const playerStealthBomber = gameState.player.fleet.sky[2];

  this.assertEquals(ai.canAttackIfHidden(playerStealthBomber), true);

  playerStealthBomber.defenseComponent.isActive = true;

  this.assertEquals(ai.canAttackIfHidden(playerStealthBomber), true);

  gameState.enemy.fleet.sky[0].destroyStruct(); // Fighter Jet
  gameState.enemy.fleet.sky[1].destroyStruct(); // High Altitude Interceptor
  gameState.enemy.fleet.sky[3].destroyStruct(); // Fighter Jet

  this.assertEquals(ai.canAttackIfHidden(playerStealthBomber), false);
});

const getCannotAttackDefenseScoreTest = new DTest('getCannotAttackDefenseScoreTest', function() {
  const gameState = new GameState();
  gameState.player = getDummyPlayer();
  gameState.enemy = getDummyPlayer();
  const ai = new AI(gameState);

  const playerTank = gameState.player.fleet.land[0];
  const enemySAM = gameState.enemy.fleet.land[2];
  const enemyStarFighter = gameState.enemy.fleet.space[0];

  this.assertEquals(ai.getCannotAttackDefenseScore(enemySAM, playerTank), 0);
  this.assertEquals(ai.getCannotAttackDefenseScore(enemyStarFighter, playerTank), 1);
});

const getAlreadyDefendingDefenseScoreTest = new DTest('getAlreadyDefendingDefenseScoreTest', function() {
  const gameState = new GameState();
  gameState.player = getDummyPlayer();
  gameState.enemy = getDummyPlayer();
  const ai = new AI(gameState);

  const commandShip = gameState.enemy.commandStruct;
  const tank = gameState.enemy.fleet.land[0];
  const sam = gameState.enemy.fleet.land[2];
  const fighterJet = gameState.enemy.fleet.sky[0];
  const starFighter = gameState.enemy.fleet.space[0];

  tank.defend(sam);
  starFighter.defend(commandShip);

  this.assertEquals(ai.getAlreadyDefendingDefenseScore(tank), 0);
  this.assertEquals(ai.getAlreadyDefendingDefenseScore(sam), 2);
  this.assertEquals(ai.getAlreadyDefendingDefenseScore(fighterJet), 2);
  this.assertEquals(ai.getAlreadyDefendingDefenseScore(starFighter), 2);
});

const getStructDefenseScoreTest = new DTest('getStructDefenseScoreTest', function(params) {
  const ai = new AI(params.gameState);

  this.assertEquals(
    ai.getStructDefenseScore(params.potentialDefender, params.structToDefend, params.attackingStruct),
    params.expectedScore
  )
}, function() {
  const gameState = new GameState();
  gameState.player = getDummyPlayer();
  gameState.enemy = getDummyPlayer();

  const playerStarFighter1 = gameState.player.fleet.space[0];
  const enemyStarFighter1 = gameState.enemy.fleet.space[0];
  const enemySub1 = gameState.enemy.fleet.water[0];
  const enemyStarFighter2 = gameState.enemy.fleet.space[3];
  enemyStarFighter2.destroyStruct();
  const playerStarFighter2 = gameState.player.fleet.space[3];
  playerStarFighter2.destroyStruct();
  const enemyTank1 = gameState.enemy.fleet.land[0];
  const enemySpaceFrigate = gameState.enemy.fleet.space[1];
  enemySpaceFrigate.defend(gameState.enemy.commandStruct);
  const enemySAM = gameState.enemy.fleet.land[2];
  enemySAM.defend(enemyTank1);
  const enemyGalacticBattleship = gameState.enemy.fleet.space[2];

  return [
    {
      expectedScore: -1,
      potentialDefender: enemyStarFighter1,
      structToDefend: enemyStarFighter1,
      attackingStruct: playerStarFighter1,
      gameState: gameState
    },
    {
      expectedScore: 3,
      potentialDefender: enemySub1,
      structToDefend: enemyStarFighter1,
      attackingStruct: playerStarFighter1,
      gameState: gameState
    },
    {
      expectedScore: -1,
      potentialDefender: enemyStarFighter2,
      structToDefend: enemyStarFighter1,
      attackingStruct: playerStarFighter1,
      gameState: gameState
    },
    {
      expectedScore: -1,
      potentialDefender: enemyStarFighter1,
      structToDefend: enemyStarFighter2,
      attackingStruct: playerStarFighter1,
      gameState: gameState
    },
    {
      expectedScore: -1,
      potentialDefender: enemySub1,
      structToDefend: enemyStarFighter1,
      attackingStruct: playerStarFighter2,
      gameState: gameState
    },
    {
      expectedScore: -1,
      potentialDefender: enemyTank1,
      structToDefend: enemyStarFighter1,
      attackingStruct: playerStarFighter1,
      gameState: gameState
    },
    {
      expectedScore: -1,
      potentialDefender: enemySpaceFrigate,
      structToDefend: enemyStarFighter1,
      attackingStruct: playerStarFighter1,
      gameState: gameState
    },
    {
      expectedScore: 1,
      potentialDefender: enemySAM,
      structToDefend: enemyStarFighter1,
      attackingStruct: playerStarFighter1,
      gameState: gameState
    },
    {
      expectedScore: 2,
      potentialDefender: enemyGalacticBattleship,
      structToDefend: enemyStarFighter1,
      attackingStruct: playerStarFighter1,
      gameState: gameState
    }
  ];
});

const chooseDefenseStructTest = new DTest('chooseDefenseStructTest', function() {
  const gameState = new GameState();
  gameState.player = getDummyPlayer();
  gameState.enemy = getDummyPlayer();
  const ai = new AI(gameState);

  // Blocking for command struct should remove space structs from selection
  gameState.enemy.fleet.space[0].defend(gameState.enemy.commandStruct);
  gameState.enemy.fleet.space[1].defend(gameState.enemy.commandStruct);
  gameState.enemy.fleet.space[2].defend(gameState.enemy.commandStruct);
  gameState.enemy.fleet.space[3].defend(gameState.enemy.commandStruct);

  // Already defending should deprioritize sky structs from selection
  gameState.enemy.fleet.sky[0].defend(gameState.enemy.fleet.space[0]);
  gameState.enemy.fleet.sky[1].defend(gameState.enemy.fleet.space[0]);
  gameState.enemy.fleet.sky[2].defend(gameState.enemy.fleet.space[0]);
  gameState.enemy.fleet.sky[3].defend(gameState.enemy.fleet.space[0]);

  // Destroyed struct should be removed from selection
  gameState.enemy.fleet.land[0].destroyStruct(); // Tank1

  const enemyTank2 = gameState.enemy.fleet.land[3];
  const playerTank1 = gameState.player.fleet.land[0]
  const chosenStruct = ai.chooseDefenseStruct(enemyTank2, playerTank1);

  this.assertEquals(chosenStruct.unitType, UNIT_TYPES.CRUISER);
  this.assertEquals(chosenStruct.id, gameState.enemy.fleet.water[2].id);
});

const defendLastAttackedStructTest = new DTest('defendLastAttackedStructTest', function() {
  const gameState = new GameState();
  gameState.player = getDummyPlayer();
  gameState.enemy = getDummyPlayer();
  const ai = new AI(gameState);

  const enemyStarFighter1 = gameState.enemy.fleet.space[0];

  this.assertEquals(enemyStarFighter1.defenders.length, 0);

  const playerSub1 = gameState.player.fleet.water[0];
  playerSub1.attack(MANUAL_WEAPON_SLOTS.PRIMARY, enemyStarFighter1);

  gameState.combatEventLog.logItem(new CombatEventLogItem(
    new CombatEvent(EVENTS.COMBAT.COMBAT_ATTACKED, playerSub1, enemyStarFighter1, 2),
    gameState.player,
    gameState.enemy
  ));

  ai.defendLastAttackedStruct();

  this.assertEquals(enemyStarFighter1.defenders.length, 1);
});

const moveCommandStructToMostDefensibleAmbitTest = new DTest('moveCommandStructToMostDefensibleAmbitTest', function() {
  const player = getDummyPlayer();
  const enemy = getDummyPlayer();
  const state = new GameState();
  state.player = player;
  state.enemy = enemy;
  const ai = new AI(state);

  this.assertEquals(state.enemy.commandStruct.operatingAmbit, AMBITS.SPACE);

  ai.turnBasedDefense();

  this.assertEquals(state.enemy.commandStruct.operatingAmbit, AMBITS.WATER);

  ai.turnBasedDefense();

  this.assertEquals(state.enemy.commandStruct.operatingAmbit, AMBITS.WATER);

  state.enemy.fleet.water[0].destroyStruct();
  state.enemy.fleet.land[0].destroyStruct();
  state.enemy.fleet.space[0].destroyStruct();

  ai.turnBasedDefense();

  this.assertEquals(state.enemy.commandStruct.operatingAmbit, AMBITS.SKY);

  state.player.fleet.space[0].destroyStruct();
  state.player.fleet.space[1].destroyStruct();
  state.player.fleet.space[2].destroyStruct();
  state.player.fleet.space[3].destroyStruct();
  state.player.fleet.sky[1].destroyStruct(); // High Altitude Interceptor
  state.player.fleet.land[2].destroyStruct(); // SAM Launcher
  state.player.fleet.water[0].destroyStruct(); // SUB 1
  state.player.fleet.water[3].destroyStruct(); // SUB 2

  ai.turnBasedDefense();

  this.assertEquals(state.enemy.commandStruct.operatingAmbit, AMBITS.SPACE);
});

const defendCommandStructWithUnusedTest = new DTest('defendCommandStructWithUnusedTest', function() {
  const player = getDummyPlayer();
  const enemy = getDummyPlayer();
  const gameState = new GameState();
  gameState.player = player;
  gameState.enemy = enemy;
  const ai = new AI(gameState);

  gameState.enemy.fleet.space[0].defend(gameState.enemy.commandStruct);
  gameState.enemy.fleet.sky[1].defend(gameState.enemy.fleet.space[2]);
  gameState.enemy.fleet.land[2].defend(gameState.enemy.fleet.sky[0]);
  gameState.enemy.fleet.water[3].defend(gameState.enemy.fleet.land[3]);

  this.assertEquals(gameState.enemy.commandStruct.defenders.length, 1);

  ai.defendCommandStructWithUnused()

  this.assertEquals(gameState.enemy.commandStruct.defenders.length, 13);
});

const isAttackingThreatViableTest = new DTest('isAttackingThreatViableTest', function() {
  const gameState = new GameState();
  gameState.player = getDummyPlayer();
  gameState.enemy = getDummyPlayer();
  const ai = new AI(gameState);

  const playerGalacticBattleship = gameState.player.fleet.space[2];
  const playerStealthBomber = gameState.player.fleet.sky[2];
  const playerTank1 = gameState.player.fleet.land[0];
  const playerArtillery = gameState.player.fleet.land[1];
  const playerTank2 = gameState.player.fleet.land[3];
  const playerDestroyer = gameState.player.fleet.water[1];
  const playerCruiser = gameState.player.fleet.water[2];

  // Undefended and doesn't counter, should be viable
  this.assertEquals(ai.isAttackingThreatViable(new AIThreatDTO(playerArtillery, 8)), true);

  playerGalacticBattleship.defend(playerArtillery);
  playerStealthBomber.defend(playerArtillery);
  playerCruiser.defend(playerArtillery);

  // Although heavily defended, Artillery can attack without being countered
  this.assertEquals(ai.isAttackingThreatViable(new AIThreatDTO(playerArtillery, 8)), true);

  playerTank1.defend(playerArtillery);

  // Tank is blocking artillery now, so it's a waste of turns to attack it now
  this.assertEquals(ai.isAttackingThreatViable(new AIThreatDTO(playerArtillery, 8)), false);

  // Don't waste turns attacking the tank since it's armoured
  this.assertEquals(ai.isAttackingThreatViable(new AIThreatDTO(playerTank2, 6)), false);

  const enemyGalacticBattleship = gameState.enemy.fleet.space[2];
  const enemyStealthBomber = gameState.enemy.fleet.sky[2];
  enemyGalacticBattleship.destroyStruct();
  enemyStealthBomber.destroyStruct();

  // Can use artillery to attack destroyer
  this.assertEquals(ai.isAttackingThreatViable(new AIThreatDTO(playerDestroyer, 6)), true);

  gameState.enemy.fleet.forEachStruct(struct => { struct.destroyStruct(); });

  // Don't use command ship to attack an off-goal unimportant struct
  this.assertEquals(gameState.enemy.commandStruct.isDestroyed, false);
  this.assertEquals(ai.isAttackingThreatViable(new AIThreatDTO(playerTank2, 6)), false);
});

const identifyThreatTest = new DTest('identifyThreatTest', function() {
  const gameState = new GameState();
  gameState.player = getDummyPlayer();
  gameState.enemy = getDummyPlayer();
  gameState.aiThreatTracker.threatThreshold = 4;
  const ai = new AI(gameState);

  const playerStarFighter1 = gameState.player.fleet.space[0];
  const playerFighterJet1 = gameState.player.fleet.sky[0];
  const playerTank1 = gameState.player.fleet.land[0];
  const playerSub1 = gameState.player.fleet.water[0];

  gameState.aiThreatTracker.trackAttack(playerStarFighter1, 2);
  gameState.aiThreatTracker.trackAttack(playerFighterJet1, 2);
  gameState.aiThreatTracker.trackAttack(playerTank1, 2);
  gameState.aiThreatTracker.trackAttack(playerSub1, 2);
  let threat = ai.identifyThreat();

  this.assertEquals(threat, null);

  gameState.aiThreatTracker.trackAttack(playerFighterJet1, 2);
  threat = ai.identifyThreat();

  this.assertEquals(threat.id, playerFighterJet1.id);

  gameState.aiThreatTracker.trackAttack(playerSub1, 2);
  gameState.aiThreatTracker.trackAttack(playerSub1, 2);
  threat = ai.identifyThreat();

  this.assertEquals(threat.id, playerSub1.id);

  playerSub1.destroyStruct();
  threat = ai.identifyThreat();

  this.assertEquals(threat.id, playerFighterJet1.id);

  playerFighterJet1.destroyStruct();
  threat = ai.identifyThreat();

  this.assertEquals(threat, null);
});

const chooseTargetTest = new DTest('chooseTargetTest', function() {
  const gameState = new GameState();
  gameState.player = getDummyPlayer();
  gameState.enemy = getDummyPlayer();
  gameState.aiThreatTracker.threatThreshold = 4;
  const ai = new AI(gameState);

  let target = ai.chooseTarget();

  this.assertEquals(target.isCommandStruct(), true);

  gameState.player.fleet.land[0].defend(gameState.player.commandStruct);

  target = ai.chooseTarget();

  this.assertEquals(target.isCommandStruct(), true);

  gameState.player.fleet.space[0].defend(gameState.player.commandStruct);

  target = ai.chooseTarget();

  this.assertEquals(target.id, gameState.player.fleet.space[0].id);

  const playerArtillery = gameState.player.fleet.land[1];
  gameState.aiThreatTracker.trackAttack(playerArtillery, 6);
  target = ai.chooseTarget();

  this.assertEquals(target.id, playerArtillery.id);

  gameState.player.fleet.space[0].destroyStruct();
  target = ai.chooseTarget();

  this.assertEquals(target.isCommandStruct(), true);
});

const shouldTargetDefendingInsteadTest = new DTest('shouldTargetDefendingInsteadTest', function(params) {
  const structBuilder = new StructBuilder();
  const ai = new AI(new GameState());
  const attackingAIStruct = structBuilder.make(params.attackingAIStructUnitType);
  const target = structBuilder.make(params.targetUnitType);
  let targetDefending = null;

  if (params.targetDefendingUnitType) {
    targetDefending = structBuilder.make(params.targetDefendingUnitType);
    target.defend(targetDefending);
  }

  params.targetDefendingDefenderUnitTypes.forEach(unitType => {
    (structBuilder.make(unitType)).defend(targetDefending);
  });

  const resultingTarget = ai.shouldTargetDefendingInstead(attackingAIStruct, target)

  this.assertEquals(resultingTarget.unitType, params.expectedTargetUnitType);
}, function () {
  return [
    {
      attackingAIStructUnitType: UNIT_TYPES.TANK,
      targetUnitType: UNIT_TYPES.SAM_LAUNCHER,
      targetDefendingUnitType: null,
      targetDefendingDefenderUnitTypes: [],
      expectedTargetUnitType: UNIT_TYPES.SAM_LAUNCHER,
    },
    {
      attackingAIStructUnitType: UNIT_TYPES.SAM_LAUNCHER,
      targetUnitType: UNIT_TYPES.FIGHTER_JET,
      targetDefendingUnitType: UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
      targetDefendingDefenderUnitTypes: [],
      expectedTargetUnitType: UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
    },
    {
      attackingAIStructUnitType: UNIT_TYPES.CRUISER,
      targetUnitType: UNIT_TYPES.FIGHTER_JET,
      targetDefendingUnitType: UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
      targetDefendingDefenderUnitTypes: [],
      expectedTargetUnitType: UNIT_TYPES.FIGHTER_JET,
    },
    {
      attackingAIStructUnitType: UNIT_TYPES.SAM_LAUNCHER,
      targetUnitType: UNIT_TYPES.FIGHTER_JET,
      targetDefendingUnitType: UNIT_TYPES.STAR_FIGHTER,
      targetDefendingDefenderUnitTypes: [],
      expectedTargetUnitType: UNIT_TYPES.FIGHTER_JET,
    },
    {
      attackingAIStructUnitType: UNIT_TYPES.SAM_LAUNCHER,
      targetUnitType: UNIT_TYPES.FIGHTER_JET,
      targetDefendingUnitType: UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
      targetDefendingDefenderUnitTypes: [UNIT_TYPES.TANK],
      expectedTargetUnitType: UNIT_TYPES.FIGHTER_JET,
    },
    {
      attackingAIStructUnitType: UNIT_TYPES.SAM_LAUNCHER,
      targetUnitType: UNIT_TYPES.FIGHTER_JET,
      targetDefendingUnitType: UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
      targetDefendingDefenderUnitTypes: [UNIT_TYPES.SUB],
      expectedTargetUnitType: UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
    },
  ];
});

const determineStallTacticsNeededTest = new DTest('determineStallTacticsNeededTest', function(params) {
  const structBuilder = new StructBuilder();
  const state = new GameState();
  state.player = new Player('Player');
  state.enemy = new Player('Enemy');
  state.player.commandStruct.operatingAmbit = params.playerCommandStructAmbit;
  state.enemy.commandStruct.operatingAmbit = params.enemyCommandStructAmbit;
  state.player.commandStruct.currentHealth = params.playerCommandStructHealth;
  state.enemy.commandStruct.currentHealth = params.enemyCommandStructHealth;
  let target = state.player.commandStruct;
  let attackingAIStruct = state.enemy.commandStruct;

  if (params.targetUnitType !== UNIT_TYPES.COMMAND_SHIP) {
    target = structBuilder.make(params.targetUnitType)
    state.player.fleet.addStruct(target);
  }

  if (params.attackingAIStructUnitType !== UNIT_TYPES.COMMAND_SHIP) {
    attackingAIStruct = structBuilder.make(params.attackingAIStructUnitType)
    state.enemy.fleet.addStruct(attackingAIStruct);
  }

  params.playerFleetUnitTypes.forEach(unitType => {
    state.player.fleet.addStruct(structBuilder.make(unitType));
  });

  params.enemyFleetUnitTypes.forEach(unitType => {
    state.enemy.fleet.addStruct(structBuilder.make(unitType));
  });

  const ai = new AI(state);
  const attackParams = new AIAttackParamsDTO(
    target,
    attackingAIStruct
  );
  ai.determineStallTacticsNeeded(attackParams);

  this.assertEquals(attackParams.target.unitType, params.expectedTargetUnitType);
  this.assertEquals(attackParams.attackingAIStruct.unitType, params.expectedAttackingAIStructUnitType);
}, function() {
  return [
    {
      targetUnitType: UNIT_TYPES.COMMAND_SHIP,
      attackingAIStructUnitType: UNIT_TYPES.COMMAND_SHIP,
      playerCommandStructAmbit: AMBITS.SPACE,
      enemyCommandStructAmbit: AMBITS.SPACE,
      playerCommandStructHealth: COMMAND_STRUCT_DEFAULTS.MAX_HEALTH,
      enemyCommandStructHealth: COMMAND_STRUCT_DEFAULTS.MAX_HEALTH,
      playerFleetUnitTypes: [],
      enemyFleetUnitTypes: [],
      expectedTargetUnitType: UNIT_TYPES.COMMAND_SHIP,
      expectedAttackingAIStructUnitType: UNIT_TYPES.COMMAND_SHIP
    },
    {
      targetUnitType: UNIT_TYPES.COMMAND_SHIP,
      attackingAIStructUnitType: UNIT_TYPES.STAR_FIGHTER,
      playerCommandStructAmbit: AMBITS.SPACE,
      enemyCommandStructAmbit: AMBITS.SPACE,
      playerCommandStructHealth: COMMAND_STRUCT_DEFAULTS.MAX_HEALTH,
      enemyCommandStructHealth: COMMAND_STRUCT_DEFAULTS.MAX_HEALTH,
      playerFleetUnitTypes: [],
      enemyFleetUnitTypes: [],
      expectedTargetUnitType: UNIT_TYPES.COMMAND_SHIP,
      expectedAttackingAIStructUnitType: UNIT_TYPES.STAR_FIGHTER
    },
    {
      targetUnitType: UNIT_TYPES.SAM_LAUNCHER,
      attackingAIStructUnitType: UNIT_TYPES.COMMAND_SHIP,
      playerCommandStructAmbit: AMBITS.SPACE,
      enemyCommandStructAmbit: AMBITS.LAND,
      playerCommandStructHealth: COMMAND_STRUCT_DEFAULTS.MAX_HEALTH,
      enemyCommandStructHealth: COMMAND_STRUCT_DEFAULTS.MAX_HEALTH,
      playerFleetUnitTypes: [],
      enemyFleetUnitTypes: [],
      expectedTargetUnitType: UNIT_TYPES.SAM_LAUNCHER,
      expectedAttackingAIStructUnitType: UNIT_TYPES.COMMAND_SHIP
    },
    {
      targetUnitType: UNIT_TYPES.TANK,
      attackingAIStructUnitType: UNIT_TYPES.COMMAND_SHIP,
      playerCommandStructAmbit: AMBITS.SPACE,
      enemyCommandStructAmbit: AMBITS.LAND,
      playerCommandStructHealth: COMMAND_STRUCT_DEFAULTS.MAX_HEALTH,
      enemyCommandStructHealth: COMMAND_STRUCT_DEFAULTS.MAX_HEALTH,
      playerFleetUnitTypes: [
        UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
        UNIT_TYPES.STAR_FIGHTER
      ],
      enemyFleetUnitTypes: [
        UNIT_TYPES.SPACE_FRIGATE,
        UNIT_TYPES.DESTROYER
      ],
      expectedTargetUnitType: UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
      expectedAttackingAIStructUnitType: UNIT_TYPES.DESTROYER
    },
    {
      targetUnitType: UNIT_TYPES.COMMAND_SHIP,
      attackingAIStructUnitType: UNIT_TYPES.COMMAND_SHIP,
      playerCommandStructAmbit: AMBITS.SPACE,
      enemyCommandStructAmbit: AMBITS.SPACE,
      playerCommandStructHealth: 2,
      enemyCommandStructHealth: COMMAND_STRUCT_DEFAULTS.MAX_HEALTH,
      playerFleetUnitTypes: [
        UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
        UNIT_TYPES.STAR_FIGHTER
      ],
      enemyFleetUnitTypes: [
        UNIT_TYPES.SPACE_FRIGATE,
        UNIT_TYPES.DESTROYER
      ],
      expectedTargetUnitType: UNIT_TYPES.COMMAND_SHIP,
      expectedAttackingAIStructUnitType: UNIT_TYPES.COMMAND_SHIP
    },
    {
      targetUnitType: UNIT_TYPES.COMMAND_SHIP,
      attackingAIStructUnitType: UNIT_TYPES.COMMAND_SHIP,
      playerCommandStructAmbit: AMBITS.SPACE,
      enemyCommandStructAmbit: AMBITS.SPACE,
      playerCommandStructHealth: 4,
      enemyCommandStructHealth: 2,
      playerFleetUnitTypes: [],
      enemyFleetUnitTypes: [],
      expectedTargetUnitType: UNIT_TYPES.COMMAND_SHIP,
      expectedAttackingAIStructUnitType: UNIT_TYPES.COMMAND_SHIP
    },
    {
      targetUnitType: UNIT_TYPES.COMMAND_SHIP,
      attackingAIStructUnitType: UNIT_TYPES.COMMAND_SHIP,
      playerCommandStructAmbit: AMBITS.SPACE,
      enemyCommandStructAmbit: AMBITS.SPACE,
      playerCommandStructHealth: 4,
      enemyCommandStructHealth: 4,
      playerFleetUnitTypes: [
        UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
        UNIT_TYPES.STAR_FIGHTER
      ],
      enemyFleetUnitTypes: [
        UNIT_TYPES.SPACE_FRIGATE,
        UNIT_TYPES.DESTROYER
      ],
      expectedTargetUnitType: UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
      expectedAttackingAIStructUnitType: UNIT_TYPES.DESTROYER
    }
  ];
});

// Test execution
DTestSuite.printSuiteHeader('AITest');
rankTargetTest.run();
determineTargetOnGoalTest.run();
getUncounterableByTargetAttackScoreTest.run();
getBlockingCommandShipAttackScoreTest.run();
getCurrentHealthAttackScoreTest.run();
getAmbitTargetingCostAttackScoreTest.run();
getUncounterableByDefendersAttackScoreTest.run();
getCanBeatCounterMeasuresAttackScoreTest.run();
getStructAttackScoreTest.run();
chooseAttackStructTest.run();
attackTest.run();
openingDefenseTest.run();
findFleetTargetingWeaknessTest.run();
findAmbitForBestDefenseTest.run();
canAttackIfHiddenTest.run();
getCannotAttackDefenseScoreTest.run();
getAlreadyDefendingDefenseScoreTest.run();
getStructDefenseScoreTest.run();
chooseDefenseStructTest.run();
defendLastAttackedStructTest.run();
moveCommandStructToMostDefensibleAmbitTest.run();
defendCommandStructWithUnusedTest.run();
isAttackingThreatViableTest.run();
identifyThreatTest.run();
chooseTargetTest.run();
shouldTargetDefendingInsteadTest.run();
determineStallTacticsNeededTest.run();
