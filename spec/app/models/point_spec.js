'use strict';

let Point = require('../../../app/models/point');

describe('Point', () => {
  afterAll((done) => global.cleanAllData().then(done));

  describe('#hashFromXML', () => {
    it('returns hash ready for sequalize to create', () => {
      expect(Point.hashFromXML(global.mockPointData({
        distance: '9033.10418104543',
        heartrate: '142',
      }))).toEqual({
        time: 1453683175000,
        latitude: 1.282346487045288,
        longitude: 103.84925305843353,
        elevation: 32.72,
        distance: 9033.10418104543,
        heartRate: 142,
      });
    });

    it('do not add value to hash when XML does not have data', () => {
      expect(Point.hashFromXML(global.mockPointData())).toEqual({
        time: 1453683175000,
        latitude: 1.282346487045288,
        longitude: 103.84925305843353,
        elevation: 32.72,
      });
    });
  });
});
