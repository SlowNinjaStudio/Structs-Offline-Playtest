import {DTest} from "../../DTestFramework.js";
import {Struct} from "../../../js/modules/Struct.js";
import {ManualWeapon} from "../../../js/modules/ManualWeapon.js";
import {AMBITS, FLEET_STRUCT_DEFAULTS} from "../../../js/modules/Constants.js";
import {PassiveWeapon} from "../../../js/modules/PassiveWeapon.js";

/**
 * @return {Struct}
 */
function getTestStruct() {
  return new Struct(
    'TANK',
    AMBITS.LAND,
    new ManualWeapon(
      'Unguided Weaponry',
      [FLEET_STRUCT_DEFAULTS.ATTACK_DAMAGE],
      false,
      AMBITS.LAND
    ),
    null,
    new PassiveWeapon(
      'Counter-Attack',
      FLEET_STRUCT_DEFAULTS.COUNTER_ATTACK_DAMAGE,
      1
    ),
  );
}

const generateIdTest = new DTest('generateIdTest', function() {
  const struct = getTestStruct();
  this.assertEquals(struct.generateId() !== struct.generateId(), true);
});

const addDefenderTest = new DTest('addDefenderTest', function () {
  const structA = new getTestStruct();
  const structB = new getTestStruct();
  const structC = new getTestStruct();
  structA.addDefender(structB);

  this.assertEquals(structA.defenders.length, 1);
  this.assertEquals(structB.id, structA.defenders[0].id);

  structA.addDefender(structC);

  this.assertEquals(structA.defenders.length, 2);
  this.assertEquals(structB.id, structA.defenders[0].id);
  this.assertEquals(structC.id, structA.defenders[1].id);
});

const removeDefenderTest = new DTest('removeDefenderTest', function () {
  const structA = getTestStruct();
  const structB = getTestStruct();
  const structC = getTestStruct();
  const structD = getTestStruct();
  structA.addDefender(structB);
  structA.addDefender(structC);
  structA.addDefender(structD);

  this.assertEquals(structA.defenders.length, 3);

  structA.removeDefender(structC);

  this.assertEquals(structA.defenders.length, 2);
  this.assertEquals(structB.id, structA.defenders[0].id);
  this.assertEquals(structD.id, structA.defenders[1].id);
});

const defendTest = new DTest('defendTest', function() {
  const structA = getTestStruct();
  const structB = getTestStruct();
  const structC = getTestStruct();
  const structD = getTestStruct();
  structA.defend(structB);

  this.assertEquals(structA.defending.id, structB.id);
  this.assertEquals(structB.defenders[0].id, structA.id);

  structC.defend(structB);

  this.assertEquals(structC.defending.id, structB.id);
  this.assertEquals(structB.defenders[1].id, structC.id);

  structA.defend(structD);

  this.assertEquals(structA.defending.id, structD.id);
  this.assertEquals(structD.defenders[0].id, structA.id);
  this.assertEquals(structB.defenders.length, 1);
  this.assertEquals(structB.defenders[0].id, structC.id);
});

const undefendTest = new DTest('undefendTest', function() {
  const structA = getTestStruct();
  const structB = getTestStruct();
  structA.defend(structB);

  this.assertEquals(structA.defending.id, structB.id);
  this.assertEquals(structB.defenders[0].id, structA.id);

  structA.undefend(structB);

  this.assertEquals(structA.defending, null);
  this.assertEquals(structB.defenders.length, 0);
});

const removeAllDefendersTest = new DTest('removeAllDefendersTest', function() {
  const structA = getTestStruct();
  const structB = getTestStruct();
  const structC = getTestStruct();
  structA.defend(structC);
  structB.defend(structC);

  this.assertEquals(structA.defending.id, structC.id);
  this.assertEquals(structB.defending.id, structC.id);
  this.assertEquals(structC.defenders.length, 2);

  structC.removeAllDefenders();
  this.assertEquals(structA.defending, null);
  this.assertEquals(structB.defending, null);
  this.assertEquals(structC.defenders.length, 0);
});

// Test execution
console.log('StructTest');
generateIdTest.run();
addDefenderTest.run();
removeDefenderTest.run();
defendTest.run();
undefendTest.run();
removeAllDefendersTest.run();
