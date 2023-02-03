import {DTest, DTestSuite} from "../../DTestFramework.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";
import {Player} from "../../../js/modules/Player.js";
import {UNIT_TYPES} from "../../../js/modules/Constants.js";
import {Planet} from "../../../js/modules/Planet.js";

const getAllStructsTest = new DTest('getAllStructsTest', function() {
  const structBuilder = new StructBuilder();

  const player = new Player('Player');
  player.fleet.space[0] = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
  player.fleet.sky[1] = structBuilder.make(UNIT_TYPES.FIGHTER_JET);
  player.fleet.land[2] = structBuilder.make(UNIT_TYPES.TANK);
  player.fleet.water[3] = structBuilder.make(UNIT_TYPES.SUB);

  const enemy = new Player('Enemy');
  enemy.fleet.space[1] = structBuilder.make(UNIT_TYPES.SPACE_FRIGATE);
  enemy.fleet.sky[1] = structBuilder.make(UNIT_TYPES.STEALTH_BOMBER);
  enemy.fleet.land[1] = structBuilder.make(UNIT_TYPES.ARTILLERY);
  enemy.fleet.water[1] = structBuilder.make(UNIT_TYPES.DESTROYER);
  enemy.planet = new Planet(enemy.id);
  enemy.planet.land[0] = structBuilder.make(UNIT_TYPES.GENERATOR);

  const playerUnitTypes = (player.getAllStructs()).map(struct => struct.unitType);
  this.assertSetEquality(
    playerUnitTypes,
    [
      UNIT_TYPES.COMMAND_SHIP,
      UNIT_TYPES.STAR_FIGHTER,
      UNIT_TYPES.FIGHTER_JET,
      UNIT_TYPES.TANK,
      UNIT_TYPES.SUB
    ]
  );

  const enemyUnitTypes = (enemy.getAllStructs()).map(struct => struct.unitType);
  this.assertSetEquality(
    enemyUnitTypes,
    [
      UNIT_TYPES.COMMAND_SHIP,
      UNIT_TYPES.GENERATOR,
      UNIT_TYPES.SPACE_FRIGATE,
      UNIT_TYPES.STEALTH_BOMBER,
      UNIT_TYPES.ARTILLERY,
      UNIT_TYPES.DESTROYER
    ]
  );
});

const forEachStructTest = new DTest('forEachStructTest', function() {
  const structBuilder = new StructBuilder();

  const enemy = new Player('Enemy');
  enemy.fleet.space[3] = structBuilder.make(UNIT_TYPES.SPACE_FRIGATE);
  enemy.fleet.sky[2] = structBuilder.make(UNIT_TYPES.STEALTH_BOMBER);
  enemy.fleet.land[1] = structBuilder.make(UNIT_TYPES.ARTILLERY);
  enemy.fleet.water[0] = structBuilder.make(UNIT_TYPES.DESTROYER);
  enemy.planet = new Planet(enemy.id);
  enemy.planet.land[0] = structBuilder.make(UNIT_TYPES.GENERATOR);

  const enemyUnitTypes = [];
  enemy.forEachStruct(struct => enemyUnitTypes.push(struct.unitType));
  this.assertSetEquality(
    enemyUnitTypes,
    [
      UNIT_TYPES.COMMAND_SHIP,
      UNIT_TYPES.GENERATOR,
      UNIT_TYPES.SPACE_FRIGATE,
      UNIT_TYPES.STEALTH_BOMBER,
      UNIT_TYPES.ARTILLERY,
      UNIT_TYPES.DESTROYER
    ]
  );
});

const getStructCountTest = new DTest('getStructCountTest', function() {
  const structBuilder = new StructBuilder();
  const player = new Player('Player');
  player.fleet.space[3] = structBuilder.make(UNIT_TYPES.SPACE_FRIGATE);
  player.fleet.sky[2] = structBuilder.make(UNIT_TYPES.STEALTH_BOMBER);
  player.fleet.land[1] = structBuilder.make(UNIT_TYPES.ARTILLERY);
  player.fleet.water[0] = structBuilder.make(UNIT_TYPES.DESTROYER);
  player.planet = new Planet(player.id);
  player.planet.land[0] = structBuilder.make(UNIT_TYPES.GENERATOR);

  this.assertEquals(player.getStructCount(), 6);
});

// Test execution
DTestSuite.printSuiteHeader('PlayerTest');
getAllStructsTest.run();
forEachStructTest.run();
getStructCountTest.run();
