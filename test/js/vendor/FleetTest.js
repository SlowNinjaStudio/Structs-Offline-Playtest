import {DTest, DTestSuite} from "../../DTestFramework.js";
import {AMBITS, POWER_GENERATORS, UNIT_TYPES} from "../../../js/modules/Constants.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";
import {Fleet} from "../../../js/modules/Fleet.js";
import {IdGenerator} from "../../../js/modules/util/IdGenerator.js";
import {PowerGeneratorFactory} from "../../../js/modules/struct_components/PowerGeneratorFactory.js";
import {Planet} from "../../../js/modules/Planet.js";
import {FleetGenerator} from "../../../js/modules/FleetGenerator.js";

const findStructByAmbitAndIdTest = new DTest('findStructByAmbitAndIdTest', function() {
  const fleet = new Fleet();
  const structBuilder = new StructBuilder();
  const structLand1 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand2 = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
  const structSky1 = structBuilder.make(UNIT_TYPES.FIGHTER_JET);

  fleet.land[0] = structLand1;
  fleet.land[1] = structLand2;
  fleet.sky[0] = structSky1;

  this.assertEquals(fleet.findStructByAmbitAndId(AMBITS.LAND, structLand1.id).id, structLand1.id);
  this.assertEquals(fleet.findStructByAmbitAndId(AMBITS.LAND, structLand2.id).id, structLand2.id);
  this.assertEquals(fleet.findStructByAmbitAndId(AMBITS.SKY, structSky1.id).id, structSky1.id);
  this.assertEquals(fleet.findStructByAmbitAndId(AMBITS.SPACE, structSky1.id), undefined);
});

const findStructByIdTest = new DTest('findStructByIdTest', function() {
  const fleet = new Fleet();
  const structBuilder = new StructBuilder();
  const structLand1 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand2 = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
  const structSky1 = structBuilder.make(UNIT_TYPES.FIGHTER_JET);
  const fakeId = (new IdGenerator()).generate();

  fleet.land[0] = structLand1;
  fleet.land[1] = structLand2;
  fleet.sky[0] = structSky1;

  this.assertEquals(fleet.findStructById(structLand1.id).id, structLand1.id);
  this.assertEquals(fleet.findStructById(structLand2.id).id, structLand2.id);
  this.assertEquals(fleet.findStructById(structSky1.id).id, structSky1.id);
  this.assertEquals(fleet.findStructById(fakeId), undefined);
});

const includesTest = new DTest('includesTest', function() {
  const fleet = new Fleet();
  const structBuilder = new StructBuilder();
  const structLand1 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand2 = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);

  fleet.land[0] = structLand1;

  this.assertEquals(fleet.includes(structLand1), true);
  this.assertEquals(fleet.includes(structLand2), false);
});

const numberOfStructsStoredTest = new DTest('numberOfStructsStoredTest', function() {
  const fleet = new Fleet();
  const structBuilder = new StructBuilder();
  const structLand1 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand2 = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
  const structSky1 = structBuilder.make(UNIT_TYPES.FIGHTER_JET);

  this.assertEquals(fleet.numberOfStructs(), 0);

  fleet.land[0] = structLand1;
  fleet.land[1] = structLand2;
  fleet.sky[0] = structSky1;

  this.assertEquals(fleet.numberOfStructs(), 3);
});

const capacityRemainingTest = new DTest('capacityRemainingTest', function() {
  const fleet = new Fleet();
  const structBuilder = new StructBuilder();
  const structLand1 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand2 = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
  const structSky1 = structBuilder.make(UNIT_TYPES.FIGHTER_JET);

  this.assertEquals(fleet.capacityRemaining(), 16);

  fleet.land[0] = structLand1;
  fleet.land[1] = structLand2;
  fleet.sky[0] = structSky1;

  this.assertEquals(fleet.capacityRemaining(), 13);
});

const ambitCapacityRemainingTest = new DTest('ambitCapacityRemainingTest', function() {
  const fleet = new Fleet();
  const structBuilder = new StructBuilder();
  const structLand1 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand2 = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
  const structSky1 = structBuilder.make(UNIT_TYPES.FIGHTER_JET);

  this.assertEquals(fleet.ambitCapacityRemaining(AMBITS.SPACE), 4);
  this.assertEquals(fleet.ambitCapacityRemaining(AMBITS.SKY), 4);
  this.assertEquals(fleet.ambitCapacityRemaining(AMBITS.LAND), 4);
  this.assertEquals(fleet.ambitCapacityRemaining(AMBITS.WATER), 4);

  fleet.land[0] = structLand1;
  fleet.land[1] = structLand2;
  fleet.sky[0] = structSky1;

  this.assertEquals(fleet.ambitCapacityRemaining(AMBITS.SPACE), 4);
  this.assertEquals(fleet.ambitCapacityRemaining(AMBITS.SKY), 3);
  this.assertEquals(fleet.ambitCapacityRemaining(AMBITS.LAND), 2);
  this.assertEquals(fleet.ambitCapacityRemaining(AMBITS.WATER), 4);
});

const isCapacityRemainingTest = new DTest('isCapacityRemainingTest', function() {
  const fleet = new Fleet('', 2);
  const structBuilder = new StructBuilder();
  const structLand1 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand2 = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);

  this.assertEquals(fleet.isCapacityRemaining(), true);

  fleet.land[0] = structLand1;

  this.assertEquals(fleet.isCapacityRemaining(), true);

  fleet.land[1] = structLand2;

  this.assertEquals(fleet.isCapacityRemaining(), false);
});

const isAmbitCapacityRemainingTest = new DTest('isAmbitCapacityRemainingTest', function() {
  const fleet = new Fleet();
  const structBuilder = new StructBuilder();
  const structLand1 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand2 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand3 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand4 = structBuilder.make(UNIT_TYPES.TANK);

  this.assertEquals(fleet.isAmbitCapacityRemaining(AMBITS.LAND), true);

  fleet.land[0] = structLand1;
  fleet.land[1] = structLand2;
  fleet.land[2] = structLand3;

  this.assertEquals(fleet.isAmbitCapacityRemaining(AMBITS.LAND), true);

  fleet.land[3] = structLand4;

  this.assertEquals(fleet.isAmbitCapacityRemaining(AMBITS.LAND), false);
  this.assertEquals(fleet.isAmbitCapacityRemaining(AMBITS.WATER), true);
});

const addStructTest = new DTest('addStructTest', function() {
  const fleet = new Fleet('test', 4, {
    SPACE: 1,
    SKY: 1,
    LAND: 2,
    WATER: 1
  });
  const structBuilder = new StructBuilder();
  const structSpace1 = structBuilder.make(UNIT_TYPES.SPACE_FRIGATE);
  const structSky1 = structBuilder.make(UNIT_TYPES.FIGHTER_JET);
  const structLand1 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand2 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand3 = structBuilder.make(UNIT_TYPES.TANK);
  const structWater1 = structBuilder.make(UNIT_TYPES.SUB);

  this.assertEquals(fleet.addStruct(structLand1), true);
  this.assertEquals(fleet.land[0].getAmbitSlot(), 0);
  this.assertEquals(fleet.land[0].playerId, 'test');

  // Can't add the same struct twice
  this.assertEquals(fleet.addStruct(structLand1), false);

  this.assertEquals(fleet.addStruct(structLand2), true);
  this.assertEquals(fleet.land[1].getAmbitSlot(), 1);
  this.assertEquals(fleet.land[1].playerId, 'test');

  // At max structs per land ambit
  this.assertEquals(fleet.addStruct(structLand3), false);

  this.assertEquals(fleet.addStruct(structWater1), true);

  // One struct remaining before hitting max structs
  this.assertEquals(fleet.canAddStruct(structSky1, 0), true);
  this.assertEquals(fleet.canAddStruct(structSpace1, 0), true);

  this.assertEquals(fleet.addStruct(structSpace1), true);

  // At max structs
  this.assertEquals(fleet.addStruct(structSky1), false);
});

const removeStructByAmbitAndIdTest = new DTest('removeStructByAmbitAndIdTest', function() {
  const fleet = new Fleet('test');
  const structBuilder = new StructBuilder();
  const structLand1 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand2 = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
  const structLand3 = structBuilder.make(UNIT_TYPES.TANK);
  const structSky1 = structBuilder.make(UNIT_TYPES.FIGHTER_JET);

  fleet.addStruct(structLand1);
  fleet.addStruct(structLand2);
  fleet.addStruct(structLand3);

  this.assertEquals(fleet.removeStructByAmbitAndId(AMBITS.SKY, structSky1.id), false);

  fleet.addStruct(structSky1, 2);

  this.assertEquals(fleet.numberOfStructs(), 4);

  this.assertEquals(structLand2.getAmbitSlot(), 1);

  this.assertEquals(structLand2.playerId, 'test');
  this.assertEquals(fleet.removeStructByAmbitAndId(AMBITS.LAND, structLand2.id), true);
  this.assertEquals(structLand2.playerId, '');

  this.assertEquals(structLand2.getAmbitSlot(), null);

  this.assertEquals(fleet.numberOfStructs(), 3);
  this.assertEquals(fleet.land[0].id, structLand1.id);
  this.assertEquals(fleet.land[1], null);
  this.assertEquals(fleet.land[2].id, structLand3.id);

  this.assertEquals(fleet.removeStructByAmbitAndId(AMBITS.SKY, structSky1.id), true);

  this.assertEquals(fleet.numberOfStructsInAmbit(AMBITS.SKY), 0);
});

const isDestroyedTest = new DTest('isDestroyedTest', function() {
  const fleet = new Fleet();
  const structBuilder = new StructBuilder();
  const structLand1 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand2 = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
  const structSky1 = structBuilder.make(UNIT_TYPES.FIGHTER_JET);

  fleet.land[0] = structLand1;
  fleet.land[1] = structLand2;
  fleet.sky[0] = structSky1;

  this.assertEquals(fleet.isDestroyed(), false);

  fleet.land[1].isDestroyed = true;

  this.assertEquals(fleet.isDestroyed(), false);

  fleet.sky[0].isDestroyed = true;

  this.assertEquals(fleet.isDestroyed(), false);

  fleet.land[0].isDestroyed = true;

  this.assertEquals(fleet.isDestroyed(), true);
});

const forEachStructTest = new DTest('forEachStructTest', function() {
  const structBuilder = new StructBuilder();
  const fleet = new Fleet();
  fleet.space[0] = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
  fleet.space[1] = structBuilder.make(UNIT_TYPES.SPACE_FRIGATE);
  fleet.space[2] = structBuilder.make(UNIT_TYPES.GALACTIC_BATTLESHIP);
  fleet.space[3] = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
  fleet.sky[0] = structBuilder.make(UNIT_TYPES.FIGHTER_JET);
  fleet.sky[1] = structBuilder.make(UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR);
  fleet.sky[2] = null;
  fleet.sky[3] = structBuilder.make(UNIT_TYPES.STEALTH_BOMBER);
  fleet.land[0] = structBuilder.make(UNIT_TYPES.TANK);
  fleet.land[1] = null;
  fleet.land[2] = structBuilder.make(UNIT_TYPES.ARTILLERY);
  fleet.land[3] = null;
  fleet.water[0] = null;
  fleet.water[1] = null;
  fleet.water[2] = null;
  fleet.water[3] = structBuilder.make(UNIT_TYPES.CRUISER);

  let structCount = {
    SPACE: 0,
    SKY: 0,
    LAND: 0,
    WATER: 0
  }
  fleet.forEachStruct(struct => {
    structCount[struct.operatingAmbit]++;
  });

  this.assertEquals(structCount.SPACE, 4);
  this.assertEquals(structCount.SKY, 3);
  this.assertEquals(structCount.LAND, 2);
  this.assertEquals(structCount.WATER, 1);
});

const generatePowerTest = new DTest('generatePowerTest', function() {
  const structBuilder = new StructBuilder();
  const generatorFactory = new PowerGeneratorFactory();

  const fleet = new Fleet();
  fleet.initAmbits();

  const galacticBattleship = structBuilder.make(UNIT_TYPES.GALACTIC_BATTLESHIP);
  galacticBattleship.powerGenerator = generatorFactory.make(POWER_GENERATORS.GENERIC.NAME);
  const starFighter = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);

  const artillery = structBuilder.make(UNIT_TYPES.ARTILLERY);
  artillery.powerGenerator = generatorFactory.make(POWER_GENERATORS.GENERIC.NAME);
  const samLauncher = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
  samLauncher.powerGenerator = generatorFactory.make(POWER_GENERATORS.GENERIC.NAME);

  const cruiser = structBuilder.make(UNIT_TYPES.CRUISER);

  fleet.space[1] = starFighter;
  fleet.space[3] = galacticBattleship;
  fleet.land[0] = artillery;
  fleet.land[2] = samLauncher;
  fleet.water[3] = cruiser;

  fleet.generatePower();

  this.assertEquals(fleet.generatePower(), POWER_GENERATORS.GENERIC.POWER_OUTPUT * 3);
});

const toFlatArrayTest = new DTest('toFlatArrayTest', function() {
  const structBuilder = new StructBuilder();
  const fleet = new Fleet();

  const starFighter = structBuilder.make(UNIT_TYPES.STAR_FIGHTER);
  const highAltitudeInterceptor = structBuilder.make(UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR);
  const samLauncher = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
  const sub = structBuilder.make(UNIT_TYPES.SUB);

  fleet.initAmbits();
  fleet.space[0] = starFighter;
  fleet.sky[1] = highAltitudeInterceptor;
  fleet.land[2] = samLauncher;
  fleet.water[3] = sub;

  const unitTypes = (fleet.toFlatArray()).map(struct => struct.unitType);

  this.assertSetEquality(
    unitTypes,
    [UNIT_TYPES.STAR_FIGHTER, UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR, UNIT_TYPES.SAM_LAUNCHER, UNIT_TYPES.SUB]
  );
});

const findGeneratorTest = new DTest('findGeneratorTest', function(params) {
  const structBuilder = new StructBuilder();
  const generator = structBuilder.make(UNIT_TYPES.GENERATOR);
  const planet = new Planet();

  this.assertEquals(planet.findGenerator(), null);

  generator.operatingAmbit = params.generatorAmbit;
  planet.addStruct(generator);

  this.assertEquals((planet.findGenerator()).operatingAmbit, params.generatorAmbit);
}, function() {
  return [
    {
      generatorAmbit: AMBITS.SPACE
    },
    {
      generatorAmbit: AMBITS.SKY
    },
    {
      generatorAmbit: AMBITS.LAND
    },
    {
      generatorAmbit: AMBITS.WATER
    }
  ];
});

const analyzeFleetAmbitAttackCapabilitiesTest = new DTest('analyzeFleetAmbitAttackCapabilitiesTest',
  function() {
    const fleet = new Fleet();
    const fleetGenerator = new FleetGenerator();
    fleetGenerator.generateCuratedFleet(fleet);

    fleet.space[2].destroyStruct();
    fleet.space[3].destroyStruct();
    fleet.sky[0].destroyStruct();
    fleet.sky[2].destroyStruct();
    fleet.sky[3].destroyStruct();
    fleet.land[0].destroyStruct();
    fleet.land[1].destroyStruct();
    fleet.land[3].destroyStruct();
    fleet.water[1].destroyStruct();
    fleet.water[2].destroyStruct();
    fleet.water[3].destroyStruct();

    const ambitAttackCapabilities = fleet.analyzeFleetAmbitAttackCapabilities();

    this.assertEquals(ambitAttackCapabilities.space, 5);
    this.assertEquals(ambitAttackCapabilities.sky, 3);
    this.assertEquals(ambitAttackCapabilities.land, 0);
    this.assertEquals(ambitAttackCapabilities.water, 1);
  }
);

// Test execution
DTestSuite.printSuiteHeader('FleetTest');
findStructByAmbitAndIdTest.run();
findStructByIdTest.run();
includesTest.run();
numberOfStructsStoredTest.run();
capacityRemainingTest.run();
ambitCapacityRemainingTest.run();
isCapacityRemainingTest.run();
isAmbitCapacityRemainingTest.run();
addStructTest.run();
removeStructByAmbitAndIdTest.run();
isDestroyedTest.run();
forEachStructTest.run();
generatePowerTest.run();
toFlatArrayTest.run();
findGeneratorTest.run();
analyzeFleetAmbitAttackCapabilitiesTest.run();
