'use strict';

let Point = require('../../../app/models/point');

describe('Point', () => {
  afterAll((done) => global.cleanAllData().then(done));

  describe('#hashFromXml', () => {
    describe('with all fields', () => {
      let hash;

      beforeEach(() => {
        hash = Point.hashFromXml(global.mockPointData({
          distance: '9033.10418104543',
          heartrate: '142',
        }));
      });

      it('returns point with informations from XML', () => {
        expect(hash).toEqual({
          time: 1453683175000,
          latitude: 1.282346487045288,
          longitude: 103.84925305843353,
          elevation: 32.72,
          distance: 9033.10418104543,
          heartRate: 142,
        });
      });
    });

    describe('with empty value in optional fields', () => {
      let hash;

      beforeEach(() => {
        hash = Point.hashFromXml(global.mockPointData());
      });

      it('returns point with empty value in optional fields', () => {
        expect(hash).toEqual({
          time: 1453683175000,
          latitude: 1.282346487045288,
          longitude: 103.84925305843353,
          elevation: 32.72,
        });
      });
    });
  });
});
