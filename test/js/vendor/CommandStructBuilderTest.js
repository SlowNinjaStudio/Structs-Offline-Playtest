import {DTest} from "../../DTestFramework.js";
import {
  AMBITS,
  DEFENSE_COMPONENTS,
  MANUAL_WEAPONS,
  PASSIVE_WEAPONS,
  UNIT_TYPES
} from "../../../js/modules/Constants.js";
import {CommandStructBuilder} from "../../../js/modules/CommandStructBuilder.js";
import {CommandStruct} from "../../../js/modules/CommandStruct.js";
import {Struct} from "../../../js/modules/Struct.js";

const makeTest = new DTest('makeTest', function(params) {
  const struct = (new CommandStructBuilder()).make(params.unitType);

  this.assertEquals(struct instanceof CommandStruct, true);
  this.assertEquals(struct instanceof Struct, true);
  this.assertEquals(struct.unitType, params.unitType);
  this.assertEquals(struct.operatingAmbit, params.operatingAmbit);
  this.assertEquals(
    !!struct.manualWeaponPrimary && struct.manualWeaponPrimary.name,
    params.manualWeaponPrimaryName
  );
  this.assertSetEquality(
    !!struct.manualWeaponPrimary ? struct.manualWeaponPrimary.ambits : [],
    params.manualWeaponPrimaryAmbits
  );
  this.assertEquals(
    !!struct.manualWeaponSecondary && struct.manualWeaponSecondary.name,
    params.manualWeaponSecondaryName
  );
  this.assertSetEquality(
    !!struct.manualWeaponSecondary ? struct.manualWeaponSecondary.ambits : [],
    params.manualWeaponSecondaryAmbits
  );
  this.assertEquals(
    !!struct.passiveWeapon && struct.passiveWeapon.name,
    params.passiveWeaponName
  );
  this.assertEquals(
    !!struct.defenseComponent && struct.defenseComponent.name,
    params.defenseComponentName
  );
}, function() {
  return [
    {
      unitType: UNIT_TYPES.COMMAND_SHIP,
      operatingAmbit: AMBITS.SPACE,
      manualWeaponPrimaryName: MANUAL_WEAPONS.GUIDED_WEAPONRY,
      manualWeaponPrimaryAmbits: [AMBITS.WATER, AMBITS.LAND, AMBITS.SKY, AMBITS.SPACE],
      manualWeaponSecondaryName: false,
      manualWeaponSecondaryAmbits: [],
      passiveWeaponName: PASSIVE_WEAPONS.STRONG_COUNTER_ATTACK,
      defenseComponentName: DEFENSE_COMPONENTS.OMNI_ENGINE
    }
  ];
});

// Test execution
console.log('CommandStructBuilderTest');
makeTest.run();
