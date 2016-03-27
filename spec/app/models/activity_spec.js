'use strict';

// let Activity = require('../../../app/models/activity');

xdescribe('Activity', () => {
  afterAll((done) => global.cleanAllData().then(done));

  describe('#addPointData', () => {
    let activity;
    let point;
    let points;

    beforeEach(done => {
      global.createActivity()
        .then(record => {
          activity = record;
          return activity.addPointData(global.mockPointData({
            altitude: '32.72',
            heartrate: '142',
          }));
        })
        .then(record => {
          point = record;
          return activity.getPoints();
        })
        .then(records => {
          points = records;
          done();
        });
    });

    it('create new point and add to activity', () => {
      expect(point).toEqual(jasmine.objectContaining({
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
