import {DTest, DTestSuite} from "../../DTestFramework.js";
import {COMMAND_STRUCT_DEFAULTS, FLEET_STRUCT_DEFAULTS, PASSIVE_WEAPONS} from "../../../js/modules/Constants.js";
import {PassiveWeaponFactory} from "../../../js/modules/struct_components/PassiveWeaponFactory.js";

const makeTest = new DTest('makeTest', function(params) {
  const weapon = (new PassiveWeaponFactory()).make(params.weaponName);

  this.assertEquals(weapon.name, params.weaponName);
  this.assertEquals(weapon.damage, params.damage);
  this.assertEquals(weapon.damageSameAmbit, params.damageSameAmbit);
  this.assertEquals(weapon.probability.toString(), params.probability);
  this.assertEquals(weapon.probabilityOnDeath.toString(), params.probabilityOnDeath);
}, function() {
  return [
    {
      weaponName: PASSIVE_WEAPONS.ADVANCED_COUNTER_ATTACK,
      damage: FLEET_STRUCT_DEFAULTS.COUNTER_ATTACK_DAMAGE,
      damageSameAmbit: FLEET_STRUCT_DEFAULTS.ATTACK_DAMAGE,
      probability: '1/1',
      probabilityOnDeath: '0/1'
    },
    {
      weaponName: PASSIVE_WEAPONS.COUNTER_ATTACK,
      damage: FLEET_STRUCT_DEFAULTS.COUNTER_ATTACK_DAMAGE,
      damageSameAmbit: FLEET_STRUCT_DEFAULTS.COUNTER_ATTACK_DAMAGE,
      probability: '1/1',
      probabilityOnDeath: '0/1'
    },
    {
      weaponName: PASSIVE_WEAPONS.LAST_RESORT,
      damage: FLEET_STRUCT_DEFAULTS.ATTACK_DAMAGE,
      damageSameAmbit: FLEET_STRUCT_DEFAULTS.ATTACK_DAMAGE,
      probability: '0/1',
      probabilityOnDeath: '1/1'
    },
    {
      weaponName: PASSIVE_WEAPONS.STRONG_COUNTER_ATTACK,
      damage: COMMAND_STRUCT_DEFAULTS.COUNTER_ATTACK_DAMAGE,
      damageSameAmbit: COMMAND_STRUCT_DEFAULTS.COUNTER_ATTACK_DAMAGE,
      probability: '1/1',
      probabilityOnDeath: '0/1'
    }
  ];
});

// Test execution
DTestSuite.printSuiteHeader('PassiveWeaponFactoryTest');
makeTest.run();
