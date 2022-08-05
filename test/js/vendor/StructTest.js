import {DTest} from "../../DTestFramework.js";
import {Struct} from "../../../js/modules/Struct.js";
import {ManualWeapon} from "../../../js/modules/ManualWeapon.js";
import {AMBITS, FLEET_STRUCT_DEFAULTS} from "../../../js/modules/Constants.js";
import {PassiveWeapon} from "../../../js/modules/PassiveWeapon.js";
import {AmbitDefense} from "../../../js/modules/AmbitDefense.js";
import {CounterAttackEvasion} from "../../../js/modules/CounterAttackEvasion.js"

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
      [AMBITS.LAND]
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

const destroyStructTest = new DTest('destroyStructTest', function() {
  const structA = getTestStruct();
  const structB = getTestStruct();
  structB.defend(structA);

  this.assertEquals(structA.isDestroyed, false);
  this.assertEquals(structA.defenders.length, 1);
  this.assertEquals(structB.defending.id, structA.id);

  structA.destroyStruct();

  this.assertEquals(structA.isDestroyed, true);
  this.assertEquals(structA.defenders.length, 0);
  this.assertEquals(structB.defending, null);
});

const takeDamageTest = new DTest('takeDamageTest', function() {
  const attacker = getTestStruct();
  const defender = getTestStruct();
  defender.maxHealth = 3;
  defender.currentHealth = 3;

  this.assertEquals(defender.isDestroyed, false);

  defender.takeDamage(2, attacker);

  this.assertEquals(defender.currentHealth, defender.maxHealth - 2);
  this.assertEquals(defender.isDestroyed, false);

  defender.takeDamage(2, attacker);

  this.assertEquals(defender.currentHealth, 0);
  this.assertEquals(defender.isDestroyed, true);
})

const canAttackTest = new DTest('canAttackTest', function(params) {
  this.assertEquals(
    params.attacker.canAttack(params.attacker.manualWeaponPrimary, params.defender),
    params.expected
  );
}, function() {
  const attacker = getTestStruct();

  const attackerDestroyed = getTestStruct();
  attackerDestroyed.isDestroyed = true;

  const defender = getTestStruct();

  const defenderDestroyed = getTestStruct();
  defenderDestroyed.isDestroyed = true;

  const defenderOutOfRangeAmbit = getTestStruct();
  defenderOutOfRangeAmbit.operatingAmbit = AMBITS.WATER;

  const ambitDefense = new AmbitDefense(
    'AMBIT_DEFENSE',
    [
      AMBITS.LAND,
      AMBITS.SKY,
      AMBITS.SPACE,
    ]
  );

  const defenderAmbitDefense = getTestStruct();
  defenderAmbitDefense.defenseComponent = ambitDefense;

  return [
    {
      attacker: attacker,
      defender: defender,
      expected: true
    },
    {
      attacker: attackerDestroyed,
      defender: defender,
      expected: false
    },
    {
      attacker: attacker,
      defender: defenderDestroyed,
      expected: false
    },
    {
      attacker: attacker,
      defender: defenderOutOfRangeAmbit,
      expected: false
    },
    {
      attacker: attacker,
      defender: ambitDefense,
      expected: false
    }
  ];
});

const canTargetAmbitTest = new DTest('canTargetAmbitTest', function(params) {
  const struct = getTestStruct();
  struct.manualWeaponPrimary = params.primary;
  struct.manualWeaponSecondary = params.secondary;

  this.assertEquals(struct.canTargetAmbit(params.ambit), params.expected);
}, function() {
  const landWeapon = new ManualWeapon(
    'LAND_WEAPON',
    [FLEET_STRUCT_DEFAULTS.ATTACK_DAMAGE],
    false,
    [AMBITS.LAND]
  );
  const waterWeapon = new ManualWeapon(
    'WATER_WEAPON',
    [FLEET_STRUCT_DEFAULTS.ATTACK_DAMAGE],
    false,
    [AMBITS.WATER]
  );
  const landWaterWeapon = new ManualWeapon(
    'WATER_WEAPON',
    [FLEET_STRUCT_DEFAULTS.ATTACK_DAMAGE],
    false,
    [AMBITS.LAND, AMBITS.WATER]
  );

  return [
    {
      primary: landWeapon,
      secondary: null,
      ambit: AMBITS.LAND,
      expected: true
    },
    {
      primary: landWeapon,
      secondary: null,
      ambit: AMBITS.WATER,
      expected: false
    },
    {
      primary: landWeapon,
      secondary: waterWeapon,
      ambit: AMBITS.LAND,
      expected: true
    },
    {
      primary: landWeapon,
      secondary: waterWeapon,
      ambit: AMBITS.WATER,
      expected: true
    },
    {
      primary: landWeapon,
      secondary: landWaterWeapon,
      ambit: AMBITS.SKY,
      expected: false
    },
    {
      primary: landWeapon,
      secondary: landWaterWeapon,
      ambit: AMBITS.LAND,
      expected: true
    },
    {
      primary: landWeapon,
      secondary: landWaterWeapon,
      ambit: AMBITS.WATER,
      expected: true
    },
  ];
});

const canCounterAttackTest = new DTest('canCounterAttackTest', function(params) {
  this.assertEquals(params.defender.canCounterAttack(params.attacker), params.expected);
}, function() {
  const attacker = getTestStruct();

  const attackerDestroyed = getTestStruct();
  attackerDestroyed.isDestroyed = true;

  const attackerOutOfRangeAmbit = getTestStruct();
  attackerOutOfRangeAmbit.operatingAmbit = AMBITS.WATER;

  const attackerCounterAttackEvasion = getTestStruct();
  attackerCounterAttackEvasion.defenseComponent = new CounterAttackEvasion('TEST', 1);

  const defender = getTestStruct();

  const defenderDestroyed = getTestStruct();
  defenderDestroyed.isDestroyed = true;

  const defenderNoCounterAttack = getTestStruct();
  defenderNoCounterAttack.passiveWeapon = null;

  return [
    {
      attacker: attacker,
      defender: defender,
      expected: true
    },
    {
      attacker: attacker,
      defender: defenderDestroyed,
      expected: false
    },
    {
      attacker: attackerDestroyed,
      defender: defender,
      expected: false
    },
    {
      attacker: attackerOutOfRangeAmbit,
      defender: defender,
      expected: false
    },
    {
      attacker: attacker,
      defender: defenderNoCounterAttack,
      expected: false
    },
    {
      attacker: attackerCounterAttackEvasion,
      defender: defender,
      expected: false
    },
  ];
});

// Test execution
console.log('StructTest');
generateIdTest.run();
addDefenderTest.run();
removeDefenderTest.run();
defendTest.run();
undefendTest.run();
removeAllDefendersTest.run();
destroyStructTest.run();
takeDamageTest.run();
canAttackTest.run();
canTargetAmbitTest.run();
canCounterAttackTest.run();
