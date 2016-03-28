'use strict';

let Point = require('../../../app/models/point');

describe('Point', () => {
  afterAll((done) => global.cleanAllData().then(done));

  describe('#fromXML', () => {
    describe('with all fields', () => {
      let point;

      beforeEach(done => {
        Point.fromXml(global.mockPointData({
          distance: '9033.10418104543',
          heartrate: '142',
        })).then(record => {
          point = record;
          done();
        });
      });

      it('returns point with informations from XML', () => {
        expect(point).toEqual(jasmine.objectContaining({
          time: 1453683175000,
          latitude: 1.282346487045288,
          longitude: 103.84925305843353,
          elevation: 32.72,
          distance: 9033.10418104543,
          heartRate: 142,
        }));
      });
    });

    describe('with empty value in optional fields', () => {
      let point;

      beforeEach(done => {
        Point.fromXml(global.mockPointData())
          .then(record => {
            point = record;
            done();
          });
      });

      it('returns point with empty value in optional fields', () => {
        expect(point).toEqual(jasmine.objectContaining({
          time: 1453683175000,
          latitude: 1.282346487045288,
          longitude: 103.84925305843353,
          elevation: 32.72,
          distance: undefined,
          heartRate: undefined,
        }));
      });
    });
  });
});
