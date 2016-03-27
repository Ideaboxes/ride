'use strict';

// let Activity = require('../../../app/models/activity');

describe('Activity', () => {
  afterAll((done) => global.cleanAllData().then(done));

  describe('#addPointData', () => {
    let activity;
    let points;

    beforeEach(done => {
      global.createActivity()
        .then(record => {
          activity = record;
          return activity.addPointXML(global.mockPointData({
            distance: '9033.10418104543',
            heartrate: '142',
          }));
        })
        .then(() => activity.getPoints())
        .then(records => {
          points = records;
          done();
        });
    });

    it('create new point and add to activity', () => {
      expect(points[0].json()).toEqual(jasmine.objectContaining({
        time: 1453683175000,
        latitude: 1.282346487045288,
        longitude: 103.84925305843353,
        elevation: 32.72,
        distance: 9033.10418104543,
        heartRate: 142,
      }));
    });

    it('adds point to activity', () => {
      expect(points.length).toEqual(1);
    });
  });
});
