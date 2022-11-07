import {DTest} from "../../DTestFramework.js";
import {
  AMBITS,
  DEFENSE_COMPONENT_TYPES,
  DEFENSE_COMPONENTS,
  FLEET_STRUCT_DEFAULTS,
  MANUAL_WEAPONS,
  PASSIVE_WEAPONS
} from "../../../js/modules/Constants.js";
import {PassiveWeaponFactory} from "../../../js/modules/struct_components/PassiveWeaponFactory.js";
import {DefenseComponentFactory} from "../../../js/modules/struct_components/DefenseComponentFactory.js";
import {ManualWeaponFactory} from "../../../js/modules/struct_components/ManualWeaponFactory.js";
import {Struct} from "../../../js/modules/Struct.js";
import {Fraction} from "../../../js/modules/util/Fraction.js";

const makeTest = new DTest('makeTest', function(params) {
  const component = (new DefenseComponentFactory()).make(params.name, params.ambits);

  this.assertEquals(component.isActive, params.isActiveExpected);

  component.isActive = params.isActiveTestValue;

  this.assertEquals(component.probability.toString(), params.probabilityExpected.toString());

  component.probability = params.probabilityTestValue;

  this.assertEquals(component.type, params.type);
  this.assertEquals(component.name, params.name);
  this.assertEquals(component.blocksTargeting(params.attacker), params.blocksTargeting);
  this.assertEquals(component.evadeCounterAttack(), params.evadeCounterAttack);

  const damageReductionResult = component.reduceAttackDamage(params.incomingDamage, params.attackingWeapon)

  this.assertEquals(
    damageReductionResult.finalDamage,
    params.reduceAttackDamage
  );
  this.assertEquals(
    component.canChangeAmbit(params.currentAmbit, params.desiredAmbit),
    params.canChangeAmbit
  );
}, function() {
  const manualWeaponFactory = new ManualWeaponFactory();
  const unguidedWeapon = manualWeaponFactory.make(MANUAL_WEAPONS.UNGUIDED_WEAPONRY, [AMBITS.LAND]);
  const guidedWeapon = manualWeaponFactory.make(MANUAL_WEAPONS.GUIDED_WEAPONRY, [AMBITS.LAND]);
  const passiveWeapon = (new PassiveWeaponFactory()).make(PASSIVE_WEAPONS.COUNTER_ATTACK);
  const attacker = new Struct(
    'TANK',
    AMBITS.LAND,
    unguidedWeapon,
    guidedWeapon,
    passiveWeapon,
  );

  return [
    {
      name: DEFENSE_COMPONENTS.ARMOUR,
      ambits: [],
      probabilityExpected: '1/1',
      probabilityTestValue: new Fraction(1, 1),
      type: DEFENSE_COMPONENT_TYPES.ARMOUR,
      isActiveExpected: true,
      isActiveTestValue: true,
      attacker: attacker,
      attackingWeapon: unguidedWeapon,
      incomingDamage: unguidedWeapon.getDamage(),
      blocksTargeting: false,
      evadeCounterAttack: false,
      reduceAttackDamage: FLEET_STRUCT_DEFAULTS.ATTACK_DAMAGE - FLEET_STRUCT_DEFAULTS.ARMOUR,
      canChangeAmbit: false,
      currentAmbit: AMBITS.LAND,
      desiredAmbit: AMBITS.SPACE
    },
    {
      name: DEFENSE_COMPONENTS.DEFENSIVE_MANEUVER,
      ambits: [],
      probabilityExpected: '2/3',
      probabilityTestValue: new Fraction(1, 1),
      type: DEFENSE_COMPONENT_TYPES.COUNTER_MEASURE,
      isActiveExpected: true,
      isActiveTestValue: true,
      attacker: attacker,
      attackingWeapon: unguidedWeapon,
      incomingDamage: unguidedWeapon.getDamage(),
      blocksTargeting: false,
      evadeCounterAttack: false,
      reduceAttackDamage: 0,
      canChangeAmbit: false,
      currentAmbit: AMBITS.LAND,
      desiredAmbit: AMBITS.SPACE
    },
    {
      name: DEFENSE_COMPONENTS.DEFENSIVE_MANEUVER,
      ambits: [],
      probabilityExpected: '2/3',
      probabilityTestValue: new Fraction(0, 1),
      type: DEFENSE_COMPONENT_TYPES.COUNTER_MEASURE,
      isActiveExpected: true,
      isActiveTestValue: true,
      attacker: attacker,
      attackingWeapon: unguidedWeapon,
      incomingDamage: unguidedWeapon.getDamage(),
      blocksTargeting: false,
      evadeCounterAttack: false,
      reduceAttackDamage: unguidedWeapon.getDamage(),
      canChangeAmbit: false,
      currentAmbit: AMBITS.LAND,
      desiredAmbit: AMBITS.SPACE
    },
    {
      name: DEFENSE_COMPONENTS.DEFENSIVE_MANEUVER,
      ambits: [],
      probabilityExpected: '2/3',
      probabilityTestValue: new Fraction(1, 1),
      type: DEFENSE_COMPONENT_TYPES.COUNTER_MEASURE,
      isActiveExpected: true,
      isActiveTestValue: true,
      attacker: attacker,
      attackingWeapon: guidedWeapon,
      incomingDamage: guidedWeapon.getDamage(),
      blocksTargeting: false,
      evadeCounterAttack: false,
      reduceAttackDamage: guidedWeapon.getDamage(),
      canChangeAmbit: false,
      currentAmbit: AMBITS.LAND,
      desiredAmbit: AMBITS.SPACE
    },
    {
      name: DEFENSE_COMPONENTS.INDIRECT_COMBAT_MODULE,
      ambits: [],
      probabilityExpected: '1/1',
      probabilityTestValue: new Fraction(1, 1),
      type: DEFENSE_COMPONENT_TYPES.EVADE_COUNTER_ATTACK,
      isActiveExpected: true,
      isActiveTestValue: true,
      attacker: attacker,
      attackingWeapon: unguidedWeapon,
      incomingDamage: unguidedWeapon.getDamage(),
      blocksTargeting: false,
      evadeCounterAttack: true,
      reduceAttackDamage: unguidedWeapon.getDamage(),
      canChangeAmbit: false,
      currentAmbit: AMBITS.LAND,
      desiredAmbit: AMBITS.SPACE
    },
    {
      name: DEFENSE_COMPONENTS.OMNI_ENGINE,
      ambits: [],
      probabilityExpected: '1/1',
      probabilityTestValue: new Fraction(1, 1),
      type: DEFENSE_COMPONENT_TYPES.AFTERMARKET_ENGINE,
      isActiveExpected: true,
      isActiveTestValue: true,
      attacker: attacker,
      attackingWeapon: unguidedWeapon,
      incomingDamage: unguidedWeapon.getDamage(),
      blocksTargeting: false,
      evadeCounterAttack: false,
      reduceAttackDamage: unguidedWeapon.getDamage(),
      canChangeAmbit: true,
      currentAmbit: AMBITS.LAND,
      desiredAmbit: AMBITS.SPACE
    },
    {
      name: DEFENSE_COMPONENTS.SIGNAL_JAMMING,
      ambits: [],
      probabilityExpected: '2/3',
      probabilityTestValue: new Fraction(1, 1),
      type: DEFENSE_COMPONENT_TYPES.COUNTER_MEASURE,
      isActiveExpected: true,
      isActiveTestValue: true,
      attacker: attacker,
      attackingWeapon: guidedWeapon,
      incomingDamage: guidedWeapon.getDamage(),
      blocksTargeting: false,
      evadeCounterAttack: false,
      reduceAttackDamage: 0,
      canChangeAmbit: false,
      currentAmbit: AMBITS.LAND,
      desiredAmbit: AMBITS.SPACE
    },
    {
      name: DEFENSE_COMPONENTS.SIGNAL_JAMMING,
      ambits: [],
      probabilityExpected: '2/3',
      probabilityTestValue: new Fraction(0, 1),
      type: DEFENSE_COMPONENT_TYPES.COUNTER_MEASURE,
      isActiveExpected: true,
      isActiveTestValue: true,
      attacker: attacker,
      attackingWeapon: guidedWeapon,
      incomingDamage: guidedWeapon.getDamage(),
      blocksTargeting: false,
      evadeCounterAttack: false,
      reduceAttackDamage: guidedWeapon.getDamage(),
      canChangeAmbit: false,
      currentAmbit: AMBITS.LAND,
      desiredAmbit: AMBITS.SPACE
    },
    {
      name: DEFENSE_COMPONENTS.SIGNAL_JAMMING,
      ambits: [],
      probabilityExpected: '2/3',
      probabilityTestValue: new Fraction(1, 1),
      type: DEFENSE_COMPONENT_TYPES.COUNTER_MEASURE,
      isActiveExpected: true,
      isActiveTestValue: true,
      attacker: attacker,
      attackingWeapon: unguidedWeapon,
      incomingDamage: unguidedWeapon.getDamage(),
      blocksTargeting: false,
      evadeCounterAttack: false,
      reduceAttackDamage: unguidedWeapon.getDamage(),
      canChangeAmbit: false,
      currentAmbit: AMBITS.LAND,
      desiredAmbit: AMBITS.SPACE
    },
    {
      name: DEFENSE_COMPONENTS.STEALTH_MODE,
      ambits: [AMBITS.LAND],
      probabilityExpected: '1/1',
      probabilityTestValue: new Fraction(1, 1),
      type: DEFENSE_COMPONENT_TYPES.AMBIT_DEFENSE,
      isActiveExpected: false,
      isActiveTestValue: true,
      attacker: attacker,
      attackingWeapon: unguidedWeapon,
      incomingDamage: unguidedWeapon.getDamage(),
      blocksTargeting: true,
      evadeCounterAttack: false,
      reduceAttackDamage: unguidedWeapon.getDamage(),
      canChangeAmbit: false,
      currentAmbit: AMBITS.LAND,
      desiredAmbit: AMBITS.SPACE
    },
    {
      name: DEFENSE_COMPONENTS.STEALTH_MODE,
      ambits: [AMBITS.LAND],
      probabilityExpected: '1/1',
      probabilityTestValue: new Fraction(1, 1),
      type: DEFENSE_COMPONENT_TYPES.AMBIT_DEFENSE,
      isActiveExpected: false,
      isActiveTestValue: false,
      attacker: attacker,
      attackingWeapon: unguidedWeapon,
      incomingDamage: unguidedWeapon.getDamage(),
      blocksTargeting: false,
      evadeCounterAttack: false,
      reduceAttackDamage: unguidedWeapon.getDamage(),
      canChangeAmbit: false,
      currentAmbit: AMBITS.LAND,
      desiredAmbit: AMBITS.SPACE
    },
    {
      name: DEFENSE_COMPONENTS.STEALTH_MODE,
      ambits: [AMBITS.WATER],
      probabilityExpected: '1/1',
      probabilityTestValue: new Fraction(1, 1),
      type: DEFENSE_COMPONENT_TYPES.AMBIT_DEFENSE,
      isActiveExpected: false,
      isActiveTestValue: true,
      attacker: attacker,
      attackingWeapon: unguidedWeapon,
      incomingDamage: unguidedWeapon.getDamage(),
      blocksTargeting: false,
      evadeCounterAttack: false,
      reduceAttackDamage: unguidedWeapon.getDamage(),
      canChangeAmbit: false,
      currentAmbit: AMBITS.LAND,
      desiredAmbit: AMBITS.SPACE
    }
  ];
});

// Test execution
console.log('DefenseComponentFactoryTest');
makeTest.run();
