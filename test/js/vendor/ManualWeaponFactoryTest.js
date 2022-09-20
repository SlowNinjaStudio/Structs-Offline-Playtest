import {DTest} from "../../DTestFramework.js";
import {AMBITS, FLEET_STRUCT_DEFAULTS, MANUAL_WEAPONS} from "../../../js/modules/Constants.js";
import {ManualWeaponFactory} from "../../../js/modules/struct_components/ManualWeaponFactory.js";

const makeTest = new DTest('makeTest', function(params) {
  const weapon = (new ManualWeaponFactory()).make(params.weaponName, params.ambits);

  this.assertEquals(weapon.name, params.weaponName);
  this.assertArrayEquals(weapon.ambits, params.ambits);
  this.assertArrayEquals(weapon.damageRange, params.damageRange);
  this.assertEquals(weapon.isGuided, params.isGuided);
}, function() {
  return [
    {
      weaponName: MANUAL_WEAPONS.ATTACK_RUN,
      ambits: [AMBITS.LAND],
      damageRange: [1, 3],
      isGuided: false
    },
    {
      weaponName: MANUAL_WEAPONS.GUIDED_WEAPONRY,
      ambits: [AMBITS.SKY, AMBITS.SPACE],
      damageRange: [FLEET_STRUCT_DEFAULTS.ATTACK_DAMAGE],
      isGuided: true
    },
    {
      weaponName: MANUAL_WEAPONS.UNGUIDED_WEAPONRY,
      ambits: [AMBITS.LAND, AMBITS.WATER],
      damageRange: [FLEET_STRUCT_DEFAULTS.ATTACK_DAMAGE],
      isGuided: false
    }
  ];
});

// Test execution
console.log('ManualWeaponFactoryTest');
makeTest.run();
