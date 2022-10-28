import {DTest} from "../../DTestFramework.js";
import {DefenseStrategyTreeNode} from "../../../js/modules/data_structures/DefenseStrategyTreeNode.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";
import {AMBITS, MANUAL_WEAPON_SLOTS, UNIT_TYPES} from "../../../js/modules/Constants.js";
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

  this.assertEquals(ai.getStructAttackScore(starFighter, commandShip1), -1);
  this.assertEquals(ai.getStructAttackScore(commandShip1, commandShip2), 1);
  this.assertEquals(ai.getStructAttackScore(sub, commandShip1), 4);
  this.assertEquals(ai.getStructAttackScore(artillery, commandShip1), Infinity);
  this.assertEquals(ai.getStructAttackScore(stealthBomber, commandShip1), Infinity);
  this.assertEquals(ai.getStructAttackScore(artillery, sub), Infinity);
  this.assertEquals(ai.getStructAttackScore(starFighter, spaceFrigate), 6);

  starFighter.destroyStruct();

  this.assertEquals(ai.getStructAttackScore(starFighter, spaceFrigate), -1);
});

const chooseAttackStructTest = new DTest('chooseAttackStructTest', function(params) {
  const gameState = new GameState();
  gameState.player = getDummyPlayer();
  gameState.enemy = getDummyPlayer();
  const target = gameState.player.fleet[params.targetAmbit].find(struct => struct.unitType === params.targetUnitType);
  const ai = new AI(gameState);

  this.assertEquals(params.expectedUnitTypes.includes(ai.chooseAttackStruct(target).unitType), true);
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

const chooseWeaponTest = new DTest('chooseWeaponTest', function(params) {
  const ai = new AI(new GameState());

  try {
    const weaponSlot = ai.chooseWeapon(params.attackStruct, params.targetAmbit);
    this.assertEquals(weaponSlot, params.expectedWeaponSlot);
  } catch(e) {
    this.assertEquals(params.exceptionExpected, true);
  }
}, function() {
  const structBuilder = new StructBuilder();
  const tank = structBuilder.make(UNIT_TYPES.TANK);
  const sub = structBuilder.make(UNIT_TYPES.SUB);
  const cruiser = structBuilder.make(UNIT_TYPES.CRUISER);
  return [
    {
      attackStruct: tank,
      targetAmbit: AMBITS.LAND,
      expectedWeaponSlot: MANUAL_WEAPON_SLOTS.PRIMARY,
      exceptionExpected: false
    },
    {
      attackStruct: sub,
      targetAmbit: AMBITS.WATER,
      expectedWeaponSlot: MANUAL_WEAPON_SLOTS.PRIMARY,
      exceptionExpected: false
    },
    {
      attackStruct: sub,
      targetAmbit: AMBITS.SPACE,
      expectedWeaponSlot: MANUAL_WEAPON_SLOTS.PRIMARY,
      exceptionExpected: false
    },
    {
      attackStruct: cruiser,
      targetAmbit: AMBITS.WATER,
      expectedWeaponSlot: MANUAL_WEAPON_SLOTS.PRIMARY,
      exceptionExpected: false
    },
    {
      attackStruct: cruiser,
      targetAmbit: AMBITS.SKY,
      expectedWeaponSlot: MANUAL_WEAPON_SLOTS.SECONDARY,
      exceptionExpected: false
    },
    {
      attackStruct: tank,
      targetAmbit: AMBITS.SKY,
      expectedWeaponSlot: null,
      exceptionExpected: true
    }
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

  let choice = ai.attack();
  const enemySamLauncher = enemy.fleet.land[2];

  this.assertEquals(choice.targetStruct.unitType, playerSpaceFrigate.unitType);
  this.assertEquals(choice.attackStruct.unitType, enemySamLauncher.unitType);
  this.assertEquals(choice.weaponSlot, MANUAL_WEAPON_SLOTS.PRIMARY);

  this.assertEquals(playerSpaceFrigate.currentHealth, 0);
  this.assertEquals(playerSpaceFrigate.isDestroyed, true);
  this.assertEquals(playerGalacticBattleship.currentHealth, 3);

  const enemyHighAltitudeInterceptor = enemy.fleet.sky[1];
  choice = ai.attack();

  this.assertEquals(choice.targetStruct.unitType, playerGalacticBattleship.unitType);
  this.assertEquals(choice.attackStruct.unitType, enemyHighAltitudeInterceptor.unitType);
  this.assertEquals(choice.weaponSlot, MANUAL_WEAPON_SLOTS.PRIMARY);

  playerGalacticBattleship.destroyStruct();
  enemyHighAltitudeInterceptor.destroyStruct();
  choice = ai.attack();

  this.assertEquals(choice.targetStruct.id, player.commandStruct.id);
  this.assertEquals(choice.attackStruct.unitType, enemySamLauncher.unitType);
  this.assertEquals(choice.weaponSlot, MANUAL_WEAPON_SLOTS.PRIMARY);
  this.assertEquals(player.commandStruct.currentHealth, 4);

  choice = ai.attack();

  this.assertEquals(choice.targetStruct.id, player.commandStruct.id);
  this.assertEquals(choice.attackStruct.unitType, enemySamLauncher.unitType);
  this.assertEquals(choice.weaponSlot, MANUAL_WEAPON_SLOTS.PRIMARY);
  this.assertEquals(player.commandStruct.currentHealth, 2);

  choice = ai.attack();

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

const analyzeFleetAmbitAttackCapabilitiesTest = new DTest('analyzeFleetAmbitAttackCapabilitiesTest',
  function() {
    const player = getDummyPlayer();
    const enemy = getDummyPlayer();
    const state = new GameState();
    state.player = player;
    state.enemy = enemy;
    const ai = new AI(state);

    destroySelectStructs(state.player.fleet);

    const ambitAttackCapabilities = ai.analyzeFleetAmbitAttackCapabilities(state.player.fleet);

    this.assertEquals(ambitAttackCapabilities.space, 5);
    this.assertEquals(ambitAttackCapabilities.sky, 3);
    this.assertEquals(ambitAttackCapabilities.land, 0);
    this.assertEquals(ambitAttackCapabilities.water, 1);
  }
);

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

const findMostOccupiedAmbitTest = new DTest('findMostOccupiedAmbitTest', function() {
  const player = getDummyPlayer();
  const enemy = getDummyPlayer();
  const state = new GameState();
  state.player = player;
  state.enemy = enemy;
  const ai = new AI(state);

  let mostOccupiedAmbit = ai.findMostOccupiedAmbit(state.enemy.fleet);

  this.assertEquals(mostOccupiedAmbit, AMBITS.WATER);

  destroySelectStructs(state.enemy.fleet);

  mostOccupiedAmbit = ai.findMostOccupiedAmbit(state.enemy.fleet);

  this.assertEquals(mostOccupiedAmbit, AMBITS.SPACE);
});

const turnBasedDefenseTest = new DTest('turnBasedDefenseTest', function() {
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

// Test execution
console.log('AITest');
rankTargetTest.run();
determineTargetTest.run();
getUncounterableAttackScoreTest.run();
getBlockingCommandShipAttackScoreTest.run();
getCurrentHealthAttackScoreTest.run();
getAmbitTargetingCostAttackScoreTest.run();
getStructAttackScoreTest.run();
chooseAttackStructTest.run();
chooseWeaponTest.run();
attackTest.run();
openingDefenseTest.run();
analyzeFleetAmbitAttackCapabilitiesTest.run();
findFleetTargetingWeaknessTest.run();
findMostOccupiedAmbitTest.run();
turnBasedDefenseTest.run();
