import {DTest} from "../../DTestFramework.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";
import {UNIT_TYPES} from "../../../js/modules/Constants.js";
import {AIThreatTracker} from "../../../js/modules/AIThreatTracker.js";
import {AIThreatDTO} from "../../../js/modules/dtos/AIThreatDTO.js";

const removeDestroyedTest = new DTest('removeDestroyedTest', function() {
  const structBuilder = new StructBuilder();
  const starFighter = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
  const fighterJet = structBuilder.make(UNIT_TYPES.FIGHTER_JET);
  const tank = structBuilder.make(UNIT_TYPES.TANK);
  const sub = structBuilder.make(UNIT_TYPES.SUB);

  const aiThreatTracker = new AIThreatTracker();
  aiThreatTracker.attackingStructs.set(starFighter.id, new AIThreatDTO(starFighter, 6));
  aiThreatTracker.attackingStructs.set(fighterJet.id, new AIThreatDTO(fighterJet, 2));
  aiThreatTracker.attackingStructs.set(tank.id, new AIThreatDTO(tank, 2));
  aiThreatTracker.attackingStructs.set(sub.id, new AIThreatDTO(sub, 8));
  aiThreatTracker.threats.set(starFighter.id, new AIThreatDTO(starFighter, 6));
  aiThreatTracker.threats.set(sub.id, new AIThreatDTO(sub, 8));

  aiThreatTracker.removeDestroyed();

  this.assertEquals(aiThreatTracker.attackingStructs.size, 4);
  this.assertEquals(aiThreatTracker.threats.size, 2);

  starFighter.destroyStruct();
  tank.destroyStruct();
  aiThreatTracker.removeDestroyed();

  this.assertEquals(aiThreatTracker.attackingStructs.size, 2);
  this.assertEquals(aiThreatTracker.attackingStructs.has(fighterJet.id), true);
  this.assertEquals(aiThreatTracker.attackingStructs.has(sub.id), true);
  this.assertEquals(aiThreatTracker.threats.size, 1);
  this.assertEquals(aiThreatTracker.attackingStructs.has(sub.id), true);
});

const trackAttackTest = new DTest('trackAttackTest', function() {
  const structBuilder = new StructBuilder();
  const starFighter = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
  const fighterJet = structBuilder.make(UNIT_TYPES.FIGHTER_JET);
  const tank = structBuilder.make(UNIT_TYPES.TANK);
  const sub = structBuilder.make(UNIT_TYPES.SUB);

  const aiThreatTracker = new AIThreatTracker();
  aiThreatTracker.threatThreshold = 4
  aiThreatTracker.trackAttack(starFighter, 2);
  aiThreatTracker.trackAttack(fighterJet, 2);
  aiThreatTracker.trackAttack(tank, 2);
  aiThreatTracker.trackAttack(sub, 4);

  this.assertEquals(aiThreatTracker.attackingStructs.size, 4);
  this.assertEquals(aiThreatTracker.threats.size, 1);
  this.assertEquals(aiThreatTracker.threats.has(sub.id), true);

  aiThreatTracker.trackAttack(starFighter, 1);

  this.assertEquals(aiThreatTracker.attackingStructs.size, 4);
  this.assertEquals(aiThreatTracker.threats.size, 1);
  this.assertEquals(aiThreatTracker.attackingStructs.get(starFighter.id).cumulativeDamage, 3);

  aiThreatTracker.trackAttack(starFighter, 1);

  this.assertEquals(aiThreatTracker.attackingStructs.size, 4);
  this.assertEquals(aiThreatTracker.threats.size, 2);
  this.assertEquals(aiThreatTracker.threats.has(sub.id), true);
  this.assertEquals(aiThreatTracker.threats.has(starFighter.id), true);
});

// Test execution
console.log('AIThreatTrackerTest');
removeDestroyedTest.run();
trackAttackTest.run();
