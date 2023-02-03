import {DTest, DTestSuite} from "../../DTestFramework.js";
import {AppraisalAmbitSet} from "../../../js/modules/AppraisalAmbitSet.js";
import {AMBITS, UNIT_TYPES} from "../../../js/modules/Constants.js";
import {AppraisalDTO} from "../../../js/modules/dtos/AppraisalDTO.js";

function getDummyAppraisalAmbitSet() {
  const appraisalAmbitSet = new AppraisalAmbitSet();

  appraisalAmbitSet[AMBITS.SPACE].push(new AppraisalDTO(UNIT_TYPES.STAR_FIGHTER, 2, 1.5));
  appraisalAmbitSet[AMBITS.SPACE].push(new AppraisalDTO(UNIT_TYPES.SPACE_FRIGATE, 2, 2.5));
  appraisalAmbitSet[AMBITS.SPACE].push(new AppraisalDTO(UNIT_TYPES.GALACTIC_BATTLESHIP, 4, 3.5));

  appraisalAmbitSet[AMBITS.SKY].push(new AppraisalDTO(UNIT_TYPES.FIGHTER_JET, 2, 1.5));
  appraisalAmbitSet[AMBITS.SKY].push(new AppraisalDTO(UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR, 3, 2.5));
  appraisalAmbitSet[AMBITS.SKY].push(new AppraisalDTO(UNIT_TYPES.STEALTH_BOMBER, 3, 3.5));

  appraisalAmbitSet[AMBITS.LAND].push(new AppraisalDTO(UNIT_TYPES.TANK, 2, 1.5));
  appraisalAmbitSet[AMBITS.LAND].push(new AppraisalDTO(UNIT_TYPES.ARTILLERY, 3, 2.5));
  appraisalAmbitSet[AMBITS.LAND].push(new AppraisalDTO(UNIT_TYPES.SAM_LAUNCHER, 2, 2.5));

  appraisalAmbitSet[AMBITS.WATER].push(new AppraisalDTO(UNIT_TYPES.SUB, 3, 2.5));
  appraisalAmbitSet[AMBITS.WATER].push(new AppraisalDTO(UNIT_TYPES.DESTROYER, 3, 2.5));
  appraisalAmbitSet[AMBITS.WATER].push(new AppraisalDTO(UNIT_TYPES.CRUISER, 5, 3.5));

  return appraisalAmbitSet;
}

const getMostExpensiveForAmbitTest = new DTest('getMostExpensiveForAmbitTest', function() {
  const appraisalAmbitSet = getDummyAppraisalAmbitSet();

  this.assertEquals(appraisalAmbitSet.getMostExpensiveForAmbit(AMBITS.SPACE).unitType, UNIT_TYPES.GALACTIC_BATTLESHIP);

  const mostExpensiveSkyUnit = appraisalAmbitSet.getMostExpensiveForAmbit(AMBITS.SKY).unitType;

  this.assertEquals([UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR, UNIT_TYPES.STEALTH_BOMBER].includes(mostExpensiveSkyUnit), true);
  this.assertEquals(appraisalAmbitSet.getMostExpensiveForAmbit(AMBITS.LAND).unitType, UNIT_TYPES.ARTILLERY);
  this.assertEquals(appraisalAmbitSet.getMostExpensiveForAmbit(AMBITS.WATER).unitType, UNIT_TYPES.CRUISER);
});

const getPricesForAmbitTest = new DTest('getPricesForAmbitTest', function() {
  const appraisalAmbitSet = getDummyAppraisalAmbitSet();

  this.assertArrayEquals(appraisalAmbitSet.getPricesForAmbit(AMBITS.SPACE), [2, 2, 4]);
  this.assertArrayEquals(appraisalAmbitSet.getPricesForAmbit(AMBITS.SKY), [2, 3, 3]);
  this.assertArrayEquals(appraisalAmbitSet.getPricesForAmbit(AMBITS.LAND), [2, 3, 2]);
  this.assertArrayEquals(appraisalAmbitSet.getPricesForAmbit(AMBITS.WATER), [3, 3, 5]);
});

const getTacticalValuesForAmbitTest = new DTest('getTacticalValuesForAmbitTest', function() {
  const appraisalAmbitSet = getDummyAppraisalAmbitSet();

  this.assertArrayEquals(appraisalAmbitSet.getTacticalValuesForAmbit(AMBITS.SPACE), [1.5, 2.5, 3.5]);
  this.assertArrayEquals(appraisalAmbitSet.getTacticalValuesForAmbit(AMBITS.SKY), [1.5, 2.5, 3.5]);
  this.assertArrayEquals(appraisalAmbitSet.getTacticalValuesForAmbit(AMBITS.LAND), [1.5, 2.5, 2.5]);
  this.assertArrayEquals(appraisalAmbitSet.getTacticalValuesForAmbit(AMBITS.WATER), [2.5, 2.5, 3.5]);
});

// Test execution
DTestSuite.printSuiteHeader('AppraisalAmbitSetTest');
getMostExpensiveForAmbitTest.run();
getPricesForAmbitTest.run();
getTacticalValuesForAmbitTest.run();
