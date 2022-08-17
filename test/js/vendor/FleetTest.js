import {DTest} from "../../DTestFramework.js";
import {AMBITS, UNIT_TYPES} from "../../../js/modules/Constants.js";
import {StructBuilder} from "../../../js/modules/StructBuilder.js";
import {Fleet} from "../../../js/modules/Fleet.js";
import {IdGenerator} from "../../../js/modules/IdGenerator.js";

const findStructByAmbitAndIdTest = new DTest('findStructByAmbitAndIdTest', function() {
  const fleet = new Fleet();
  const structBuilder = new StructBuilder();
  const structLand1 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand2 = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
  const structSky1 = structBuilder.make(UNIT_TYPES.FIGHTER_JET);

  fleet.land.push(structLand1);
  fleet.land.push(structLand2);
  fleet.sky.push(structSky1);

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

  fleet.land.push(structLand1);
  fleet.land.push(structLand2);
  fleet.sky.push(structSky1);

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

  fleet.land.push(structLand1);

  this.assertEquals(fleet.includes(structLand1), true);
  this.assertEquals(fleet.includes(structLand2), false);
});

const numberOfStructsStoredTest = new DTest('numberOfStructsStoredTest', function() {
  const fleet = new Fleet();
  const structBuilder = new StructBuilder();
  const structLand1 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand2 = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
  const structSky1 = structBuilder.make(UNIT_TYPES.FIGHTER_JET);

  this.assertEquals(fleet.numberOfStructsStored(), 0);

  fleet.land.push(structLand1);
  fleet.land.push(structLand2);
  fleet.sky.push(structSky1);

  this.assertEquals(fleet.numberOfStructsStored(), 3);
});

const capacityRemainingTest = new DTest('capacityRemainingTest', function() {
  const fleet = new Fleet();
  const structBuilder = new StructBuilder();
  const structLand1 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand2 = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
  const structSky1 = structBuilder.make(UNIT_TYPES.FIGHTER_JET);

  this.assertEquals(fleet.capacityRemaining(), 16);

  fleet.land.push(structLand1);
  fleet.land.push(structLand2);
  fleet.sky.push(structSky1);

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

  fleet.land.push(structLand1);
  fleet.land.push(structLand2);
  fleet.sky.push(structSky1);

  this.assertEquals(fleet.ambitCapacityRemaining(AMBITS.SPACE), 4);
  this.assertEquals(fleet.ambitCapacityRemaining(AMBITS.SKY), 3);
  this.assertEquals(fleet.ambitCapacityRemaining(AMBITS.LAND), 2);
  this.assertEquals(fleet.ambitCapacityRemaining(AMBITS.WATER), 4);
});

const isCapacityRemainingTest = new DTest('isCapacityRemainingTest', function() {
  const fleet = new Fleet(2);
  const structBuilder = new StructBuilder();
  const structLand1 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand2 = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);

  this.assertEquals(fleet.isCapacityRemaining(), true);

  fleet.land.push(structLand1);

  this.assertEquals(fleet.isCapacityRemaining(), true);

  fleet.land.push(structLand2);

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

  fleet.land.push(structLand1);
  fleet.land.push(structLand2);
  fleet.land.push(structLand3);

  this.assertEquals(fleet.isAmbitCapacityRemaining(AMBITS.LAND), true);

  fleet.land.push(structLand4);

  this.assertEquals(fleet.isAmbitCapacityRemaining(AMBITS.LAND), false);
  this.assertEquals(fleet.isAmbitCapacityRemaining(AMBITS.WATER), true);
});

const addStructTest = new DTest('addStructTest', function() {
  const fleet = new Fleet(3, {
    SPACE: 1,
    SKY: 1,
    LAND: 1,
    WATER: 1
  });
  const structBuilder = new StructBuilder();
  const structSpace1 = structBuilder.make(UNIT_TYPES.SPACE_FRIGATE);
  const structSky1 = structBuilder.make(UNIT_TYPES.FIGHTER_JET);
  const structLand1 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand2 = structBuilder.make(UNIT_TYPES.TANK);
  const structWater1 = structBuilder.make(UNIT_TYPES.SUB);

  this.assertEquals(fleet.addStruct(structLand1), true);

  // Can't add the same struct twice
  this.assertEquals(fleet.addStruct(structLand1), false);

  // At max structs per land ambit
  this.assertEquals(fleet.addStruct(structLand2), false);

  this.assertEquals(fleet.addStruct(structWater1), true);

  // One struct remaining before hitting max structs
  this.assertEquals(fleet.canAddStruct(structSky1), true);
  this.assertEquals(fleet.canAddStruct(structSpace1), true);

  this.assertEquals(fleet.addStruct(structSpace1), true);

  // At max structs
  this.assertEquals(fleet.addStruct(structSky1), false);
});

const removeStructByAmbitAndIdTest = new DTest('removeStructByAmbitAndIdTest', function() {
  const fleet = new Fleet();
  const structBuilder = new StructBuilder();
  const structLand1 = structBuilder.make(UNIT_TYPES.TANK);
  const structLand2 = structBuilder.make(UNIT_TYPES.SAM_LAUNCHER);
  const structLand3 = structBuilder.make(UNIT_TYPES.TANK);
  const structSky1 = structBuilder.make(UNIT_TYPES.FIGHTER_JET);

  fleet.land.push(structLand1);
  fleet.land.push(structLand2);
  fleet.land.push(structLand3);

  this.assertEquals(fleet.removeStructByAmbitAndId(AMBITS.SKY, structSky1.id), false);

  fleet.sky.push(structSky1);

  this.assertEquals(fleet.numberOfStructsStored(), 4);

  this.assertEquals(fleet.removeStructByAmbitAndId(AMBITS.LAND, structLand2.id), true);

  this.assertEquals(fleet.numberOfStructsStored(), 3);
  this.assertEquals(fleet.land[0].id, structLand1.id);
  this.assertEquals(fleet.land[1].id, structLand3.id);

  this.assertEquals(fleet.removeStructByAmbitAndId(AMBITS.SKY, structSky1.id), true);

  this.assertEquals(fleet.sky.length, 0);
});

// Test execution
console.log('FleetTest');
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
