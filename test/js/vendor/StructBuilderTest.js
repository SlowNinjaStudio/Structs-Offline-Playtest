import {DTest, DTestSuite} from "../../DTestFramework.js";
import {
  AMBITS,
  DEFENSE_COMPONENTS,
  MANUAL_WEAPONS,
  PASSIVE_WEAPONS, POWER_GENERATORS,
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
  this.assertEquals(
    !!struct.powerGenerator && struct.powerGenerator.name,
    params.powerGeneratorName
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
      defenseComponentName: DEFENSE_COMPONENTS.INDIRECT_COMBAT_MODULE,
      powerGeneratorName: false,
    },
    {
      unitType: UNIT_TYPES.CRUISER,
      operatingAmbit: AMBITS.WATER,
      manualWeaponPrimaryName: MANUAL_WEAPONS.GUIDED_WEAPONRY,
      manualWeaponPrimaryAmbits: [AMBITS.LAND, AMBITS.WATER],
      manualWeaponSecondaryName: MANUAL_WEAPONS.UNGUIDED_WEAPONRY,
      manualWeaponSecondaryAmbits: [AMBITS.SKY],
      passiveWeaponName: PASSIVE_WEAPONS.COUNTER_ATTACK,
      defenseComponentName: DEFENSE_COMPONENTS.SIGNAL_JAMMING,
      powerGeneratorName: false,
    },
    {
      unitType: UNIT_TYPES.DESTROYER,
      operatingAmbit: AMBITS.WATER,
      manualWeaponPrimaryName: MANUAL_WEAPONS.GUIDED_WEAPONRY,
      manualWeaponPrimaryAmbits: [AMBITS.WATER, AMBITS.SKY],
      manualWeaponSecondaryName: false,
      manualWeaponSecondaryAmbits: [],
      passiveWeaponName: PASSIVE_WEAPONS.ADVANCED_COUNTER_ATTACK,
      defenseComponentName: '',
      powerGeneratorName: false,
    },
    {
      unitType: UNIT_TYPES.FIGHTER_JET,
      operatingAmbit: AMBITS.SKY,
      manualWeaponPrimaryName: MANUAL_WEAPONS.GUIDED_WEAPONRY,
      manualWeaponPrimaryAmbits: [AMBITS.SKY],
      manualWeaponSecondaryName: false,
      manualWeaponSecondaryAmbits: [],
      passiveWeaponName: PASSIVE_WEAPONS.COUNTER_ATTACK,
      defenseComponentName: DEFENSE_COMPONENTS.SIGNAL_JAMMING,
      powerGeneratorName: false,
    },
    {
      unitType: UNIT_TYPES.GALACTIC_BATTLESHIP,
      operatingAmbit: AMBITS.SPACE,
      manualWeaponPrimaryName: MANUAL_WEAPONS.UNGUIDED_WEAPONRY,
      manualWeaponPrimaryAmbits: [AMBITS.WATER, AMBITS.LAND, AMBITS.SPACE],
      manualWeaponSecondaryName: false,
      manualWeaponSecondaryAmbits: [],
      passiveWeaponName: PASSIVE_WEAPONS.COUNTER_ATTACK,
      defenseComponentName: DEFENSE_COMPONENTS.SIGNAL_JAMMING,
      powerGeneratorName: false,
    },
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
    },
    {
      unitType: UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
      operatingAmbit: AMBITS.SKY,
      manualWeaponPrimaryName: MANUAL_WEAPONS.GUIDED_WEAPONRY,
      manualWeaponPrimaryAmbits: [AMBITS.SKY, AMBITS.SPACE],
      manualWeaponSecondaryName: false,
      manualWeaponSecondaryAmbits: [],
      passiveWeaponName: PASSIVE_WEAPONS.COUNTER_ATTACK,
      defenseComponentName: DEFENSE_COMPONENTS.DEFENSIVE_MANEUVER,
      powerGeneratorName: false
    },
    {
      unitType: UNIT_TYPES.SAM_LAUNCHER,
      operatingAmbit: AMBITS.LAND,
      manualWeaponPrimaryName: MANUAL_WEAPONS.GUIDED_WEAPONRY,
      manualWeaponPrimaryAmbits: [AMBITS.SKY, AMBITS.SPACE],
      manualWeaponSecondaryName: false,
      manualWeaponSecondaryAmbits: [],
      passiveWeaponName: PASSIVE_WEAPONS.COUNTER_ATTACK,
      defenseComponentName: '',
      powerGeneratorName: false
    },
    {
      unitType: UNIT_TYPES.SPACE_FRIGATE,
      operatingAmbit: AMBITS.SPACE,
      manualWeaponPrimaryName: MANUAL_WEAPONS.GUIDED_WEAPONRY,
      manualWeaponPrimaryAmbits: [AMBITS.SKY, AMBITS.SPACE],
      manualWeaponSecondaryName: false,
      manualWeaponSecondaryAmbits: [],
      passiveWeaponName: PASSIVE_WEAPONS.COUNTER_ATTACK,
      defenseComponentName: '',
      powerGeneratorName: false
    },
    {
      unitType: UNIT_TYPES.STAR_FIGHTER,
      operatingAmbit: AMBITS.SPACE,
      manualWeaponPrimaryName: MANUAL_WEAPONS.GUIDED_WEAPONRY,
      manualWeaponPrimaryAmbits: [AMBITS.SPACE],
      manualWeaponSecondaryName: MANUAL_WEAPONS.ATTACK_RUN,
      manualWeaponSecondaryAmbits: [AMBITS.SPACE],
      passiveWeaponName: PASSIVE_WEAPONS.COUNTER_ATTACK,
      defenseComponentName: '',
      powerGeneratorName: false
    },
    {
      unitType: UNIT_TYPES.STEALTH_BOMBER,
      operatingAmbit: AMBITS.SKY,
      manualWeaponPrimaryName: MANUAL_WEAPONS.GUIDED_WEAPONRY,
      manualWeaponPrimaryAmbits: [AMBITS.WATER, AMBITS.LAND],
      manualWeaponSecondaryName: false,
      manualWeaponSecondaryAmbits: [],
      passiveWeaponName: PASSIVE_WEAPONS.COUNTER_ATTACK,
      defenseComponentName: DEFENSE_COMPONENTS.STEALTH_MODE,
      powerGeneratorName: false
    },
    {
      unitType: UNIT_TYPES.SUB,
      operatingAmbit: AMBITS.WATER,
      manualWeaponPrimaryName: MANUAL_WEAPONS.GUIDED_WEAPONRY,
      manualWeaponPrimaryAmbits: [AMBITS.WATER, AMBITS.SPACE],
      manualWeaponSecondaryName: false,
      manualWeaponSecondaryAmbits: [],
      passiveWeaponName: PASSIVE_WEAPONS.COUNTER_ATTACK,
      defenseComponentName: DEFENSE_COMPONENTS.STEALTH_MODE,
      powerGeneratorName: false
    },
    {
      unitType: UNIT_TYPES.TANK,
      operatingAmbit: AMBITS.LAND,
      manualWeaponPrimaryName: MANUAL_WEAPONS.UNGUIDED_WEAPONRY,
      manualWeaponPrimaryAmbits: [AMBITS.LAND],
      manualWeaponSecondaryName: false,
      manualWeaponSecondaryAmbits: [],
      passiveWeaponName: PASSIVE_WEAPONS.COUNTER_ATTACK,
      defenseComponentName: DEFENSE_COMPONENTS.ARMOUR,
      powerGeneratorName: false
    }
  ];
});

// Test execution
DTestSuite.printSuiteHeader('StructBuilderTest');
makeTest.run();
