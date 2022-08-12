import {DTest} from "../../DTestFramework.js";
import {
  AMBITS,
  DEFENSE_COMPONENTS,
  MANUAL_WEAPONS,
  PASSIVE_WEAPONS,
  UNIT_TYPES
} from "../../../js/modules/Constants.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";

const makeTest = new DTest('makeTest', function(params) {
  const struct = (new StructBuilder()).make(params.unitType);

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
      unitType: UNIT_TYPES.ARTILLERY,
      operatingAmbit: AMBITS.LAND,
      manualWeaponPrimaryName: MANUAL_WEAPONS.UNGUIDED_WEAPONRY,
      manualWeaponPrimaryAmbits: [AMBITS.LAND, AMBITS.WATER],
      manualWeaponSecondaryName: false,
      manualWeaponSecondaryAmbits: [],
      passiveWeaponName: false,
      defenseComponentName: DEFENSE_COMPONENTS.INDIRECT_COMBAT_MODULE
    },
    {
      unitType: UNIT_TYPES.CRUISER,
      operatingAmbit: AMBITS.WATER,
      manualWeaponPrimaryName: MANUAL_WEAPONS.GUIDED_WEAPONRY,
      manualWeaponPrimaryAmbits: [AMBITS.LAND, AMBITS.WATER],
      manualWeaponSecondaryName: MANUAL_WEAPONS.UNGUIDED_WEAPONRY,
      manualWeaponSecondaryAmbits: [AMBITS.SKY],
      passiveWeaponName: PASSIVE_WEAPONS.COUNTER_ATTACK,
      defenseComponentName: DEFENSE_COMPONENTS.SIGNAL_JAMMING
    },
    {
      unitType: UNIT_TYPES.DESTROYER,
      operatingAmbit: AMBITS.WATER,
      manualWeaponPrimaryName: MANUAL_WEAPONS.GUIDED_WEAPONRY,
      manualWeaponPrimaryAmbits: [AMBITS.WATER, AMBITS.SKY],
      manualWeaponSecondaryName: false,
      manualWeaponSecondaryAmbits: [],
      passiveWeaponName: PASSIVE_WEAPONS.ADVANCED_COUNTER_ATTACK,
      defenseComponentName: ''
    }
  ];
});

// Test execution
console.log('StructBuilderTest');
makeTest.run();
