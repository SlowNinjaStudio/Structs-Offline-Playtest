import {DTest} from "../../DTestFramework.js";
import {CombatEventLog} from "../../../js/modules/CombatEventLog.js";
import {CombatEventLogItem} from "../../../js/modules/CombatEventLogItem.js";
import {CombatEvent} from "../../../js/modules/CombatEvent.js";
import {Player} from "../../../js/modules/Player.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";
import {EVENTS, UNIT_TYPES} from "../../../js/modules/Constants.js";

/**
 * @return {Player}
 */
function getDummyPlayer(playerName) {
  const player = new Player(playerName);
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

const findLastAttackByPlayerTest = new DTest('findLastAttackByPlayerTest', function () {
  const player = getDummyPlayer('Player');
  const enemy = getDummyPlayer('Enemy');
  const log = new CombatEventLog();

  // Player Star Fighter 1 Attacks Enemy Space Frigate
  log.logItem(new CombatEventLogItem(
    new CombatEvent(
      EVENTS.COMBAT.COMBAT_TARGETED,
      player.fleet.space[0], // Star Fighter 1
      enemy.fleet.space[1] // Space Frigate
    ),
    player,
    enemy
  ));
  log.logItem(new CombatEventLogItem(
    new CombatEvent(
      EVENTS.COMBAT.COMBAT_ATTACKED,
      player.fleet.space[0], // Star Fighter 1
      enemy.fleet.space[1], // Space Frigate
      2
    ),
    player,
    enemy
  ));
  log.logItem(new CombatEventLogItem(
    new CombatEvent(
      EVENTS.COMBAT.COMBAT_COUNTER_ATTACKED,
      enemy.fleet.space[1], // Space Frigate
      player.fleet.space[0], // Star Fighter 1
      1
    ),
    player,
    enemy
  ));
  log.logItem(new CombatEventLogItem(
    new CombatEvent(
      EVENTS.COMBAT.COMBAT_ENDED,
      player.fleet.space[0], // Star Fighter 1
      enemy.fleet.space[1] // Space Frigate
    ),
    player,
    enemy
  ));

  // Enemy Stealth Bomber Attacks Player Tank
  log.logItem(new CombatEventLogItem(
    new CombatEvent(
      EVENTS.COMBAT.COMBAT_TARGETED,
      enemy.fleet.sky[2], // Stealth Bomber
      player.fleet.land[0] // Tank
    ),
    player,
    enemy
  ));
  log.logItem(new CombatEventLogItem(
    new CombatEvent(
      EVENTS.COMBAT.COMBAT_ATTACKED,
      enemy.fleet.sky[2], // Stealth Bomber
      player.fleet.land[0], // Tank
      1
    ),
    player,
    enemy
  ));
  log.logItem(new CombatEventLogItem(
    new CombatEvent(
      EVENTS.COMBAT.COMBAT_ENDED,
      enemy.fleet.sky[2], // Stealth Bomber
      player.fleet.land[0], // Tank
    ),
    player,
    enemy
  ));

  // Player Artillery Attacks Enemy Sub
  log.logItem(new CombatEventLogItem(
    new CombatEvent(
      EVENTS.COMBAT.COMBAT_TARGETED,
      player.fleet.land[1], // Artillery
      enemy.fleet.water[0] // Sub
    ),
    player,
    enemy
  ));
  log.logItem(new CombatEventLogItem(
    new CombatEvent(
      EVENTS.COMBAT.COMBAT_ATTACKED,
      player.fleet.land[1], // Artillery
      enemy.fleet.water[0], // Sub
      2
    ),
    player,
    enemy
  ));
  log.logItem(new CombatEventLogItem(
    new CombatEvent(
      EVENTS.COMBAT.COMBAT_ENDED,
      player.fleet.land[1], // Artillery
      enemy.fleet.water[0], // Sub
    ),
    player,
    enemy
  ));

  let logItem = log.findLastAttackByPlayer(player);

  // Verify the Player's last attack
  this.assertEquals(logItem.sourcePlayerId, player.id);
  this.assertEquals(logItem.sourceUnitType, UNIT_TYPES.ARTILLERY);
  this.assertEquals(logItem.eventType, EVENTS.COMBAT.COMBAT_ATTACKED);
  this.assertEquals(logItem.targetPlayerId, enemy.id);
  this.assertEquals(logItem.targetUnitType, UNIT_TYPES.SUB);

  // Verify additional data
  this.assertEquals(logItem.sourcePlayerName, player.name);
  this.assertEquals(logItem.sourceStructId, player.fleet.land[1].id);
  this.assertEquals(logItem.sourceOperatingAmbit, player.fleet.land[1].operatingAmbit);
  this.assertEquals(logItem.sourceDisplayAmbitSlot, player.fleet.land[1].getDisplayAmbitSlot());
  this.assertEquals(logItem.sourceImage, player.fleet.land[1].image);
  this.assertEquals(logItem.targetPlayerName, enemy.name);
  this.assertEquals(logItem.targetStructId, enemy.fleet.water[0].id);
  this.assertEquals(logItem.targetOperatingAmbit, enemy.fleet.water[0].operatingAmbit);
  this.assertEquals(logItem.targetSlot, enemy.fleet.water[0].getDisplayAmbitSlot());
  this.assertEquals(logItem.targetImage, enemy.fleet.water[0].image);

  logItem = log.findLastAttackByPlayer(enemy);

  // Verify the Enemy's last attack
  this.assertEquals(logItem.sourcePlayerId, enemy.id);
  this.assertEquals(logItem.sourceUnitType, UNIT_TYPES.STEALTH_BOMBER);
  this.assertEquals(logItem.eventType, EVENTS.COMBAT.COMBAT_ATTACKED);
  this.assertEquals(logItem.targetPlayerId, player.id);
  this.assertEquals(logItem.targetUnitType, UNIT_TYPES.TANK);
});

// Test execution
console.log('CombatEventLogTest');
findLastAttackByPlayerTest.run();
