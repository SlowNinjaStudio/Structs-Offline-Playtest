import {DTest} from "../../DTestFramework.js";
import {AmbitDistribution} from "../../../js/modules/AmbitDistribution.js";
import {AMBITS} from "../../../js/modules/Constants.js";

const setGetTest = new DTest('setGetTest', function() {
  const dist = new AmbitDistribution();
  dist.set(AMBITS.SPACE, 1);
  dist.set('SKY', 3);
  dist.set('land', 7);
  dist.set('Water', 15);

  this.assertEquals(dist.get('Space'), 1);
  this.assertEquals(dist.get('sky'), 3);
  this.assertEquals(dist.get('LAND'), 7);
  this.assertEquals(dist.get(AMBITS.WATER), 15);
});

const incrementTest = new DTest('incrementTest', function() {
  const dist = new AmbitDistribution();
  dist.space = 0;
  dist.sky = 1;
  dist.land = 2;
  dist.water = 3;

  dist.increment(AMBITS.SPACE, 1);
  dist.increment('SKY', 2);
  dist.increment('land', 3);
  dist.increment('Water', 4);

  this.assertEquals(dist.get(AMBITS.SPACE), 1);
  this.assertEquals(dist.get(AMBITS.SKY), 3);
  this.assertEquals(dist.get(AMBITS.LAND), 5);
  this.assertEquals(dist.get(AMBITS.WATER), 7);
});

const getAverageTest = new DTest('getAverageTest', function(params) {
  const dist = new AmbitDistribution();
  dist.space = params.space;
  dist.sky = params.sky;
  dist.land = params.land;
  dist.water = params.water;

  this.assertEquals(dist.getAverage(), params.expected);
}, function() {
  return [
    {
      space: 0,
      sky: 0,
      land: 0,
      water: 0,
      expected: 0
    },
    {
      space: 2,
      sky: 2,
      land: 2,
      water: 2,
      expected: 2
    },
    {
      space: 2,
      sky: 4,
      land: 6,
      water: 8,
      expected: 5
    },
    {
      space: 3,
      sky: 5,
      land: 6,
      water: 8,
      expected: 5.5
    },
  ];
});

const getPopulationVarianceTest = new DTest('getPopulationVarianceTest', function(params) {
  const dist = new AmbitDistribution();
  dist.space = params.space;
  dist.sky = params.sky;
  dist.land = params.land;
  dist.water = params.water;

  this.assertEquals(dist.getPopulationVariance(), params.expected);
}, function() {
  return [
    {
      space: 0,
      sky: 0,
      land: 0,
      water: 0,
      expected: 0
    },
    {
      space: 2,
      sky: 2,
      land: 2,
      water: 2,
      expected: 0
    },
    {
      space: 2,
      sky: 4,
      land: 6,
      water: 12,
      expected: 14
    }
  ];
});

const addTest = new DTest('addTest', function() {
  const dist1 = new AmbitDistribution();
  dist1.space = 1;
  dist1.sky = 2;
  dist1.land = 3;
  dist1.water = 4;

  const dist2 = new AmbitDistribution();
  dist2.space = 3;
  dist2.sky = 5;
  dist2.land = 7;
  dist2.water = 9;

  let distSum = dist1.add(dist2);

  this.assertEquals(distSum.space, 4);
  this.assertEquals(distSum.sky, 7);
  this.assertEquals(distSum.land, 10);
  this.assertEquals(distSum.water, 13);

  this.assertEquals(dist1.space, 1);
  this.assertEquals(dist1.sky, 2);
  this.assertEquals(dist1.land, 3);
  this.assertEquals(dist1.water, 4);

  this.assertEquals(dist2.space, 3);
  this.assertEquals(dist2.sky, 5);
  this.assertEquals(dist2.land, 7);
  this.assertEquals(dist2.water, 9);

  distSum = dist2.add(dist1);

  this.assertEquals(distSum.space, 4);
  this.assertEquals(distSum.sky, 7);
  this.assertEquals(distSum.land, 10);
  this.assertEquals(distSum.water, 13);

  this.assertEquals(dist1.space, 1);
  this.assertEquals(dist1.sky, 2);
  this.assertEquals(dist1.land, 3);
  this.assertEquals(dist1.water, 4);

  this.assertEquals(dist2.space, 3);
  this.assertEquals(dist2.sky, 5);
  this.assertEquals(dist2.land, 7);
  this.assertEquals(dist2.water, 9);
});

const getTotalTest = new DTest('getTotalTest', function(params) {
  const dist = new AmbitDistribution();
  dist.space = params.space;
  dist.sky = params.sky;
  dist.land = params.land;
  dist.water = params.water;

  this.assertEquals(dist.getTotal(), params.expected);
}, function() {
  return [
    {
      space: 0,
      sky: 0,
      land: 0,
      water: 0,
      expected: 0
    },
    {
      space: 2,
      sky: 2,
      land: 2,
      water: 2,
      expected: 8
    },
    {
      space: 2,
      sky: 4,
      land: 6,
      water: 12,
      expected: 24
    }
  ];
});

// Test execution
console.log('AmbitDistributionTest');
setGetTest.run();
incrementTest.run();
getAverageTest.run();
getPopulationVarianceTest.run();
addTest.run();
getTotalTest.run();
