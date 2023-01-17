import {DTest} from "../../DTestFramework.js";
import {
  AMBITS,
  POWER_GENERATORS,
  UNIT_TYPES
} from "../../../js/modules/Constants.js";
import {Struct} from "../../../js/modules/Struct.js";
import {PlanetaryStructBuilder} from "../../../js/modules/PlanetaryStructBuilder.js";
import {PlanetaryStruct} from "../../../js/modules/PlanetaryStruct.js";

const makeTest = new DTest('makeTest', function(params) {
  const struct = (new PlanetaryStructBuilder()).make(params.unitType);

  this.assertEquals(struct instanceof PlanetaryStruct, true);
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
  this.assertEquals(
    !!struct.powerGenerator && struct.powerGenerator.name,
    params.powerGeneratorName
  );
}, function() {
  return [
    {
      unitType: UNIT_TYPES.GENERATOR,
      operatingAmbit: AMBITS.LAND,
      manualWeaponPrimaryName: false,
      manualWeaponPrimaryAmbits: [],
      manualWeaponSecondaryName: false,
      manualWeaponSecondaryAmbits: [],
      passiveWeaponName: false,
      defenseComponentName: '',
      powerGeneratorName: POWER_GENERATORS.GENERIC.NAME
    }
  ];
});

// Test execution
console.log('PlanetaryStructBuilderTest');
makeTest.run();
