'use strict';

// let Activity = require('../../../app/models/activity');

fdescribe('Activity', () => {
  afterAll((done) => global.cleanAllData().then(done));

  describe('#addPointData', () => {
    let activity;
    let point;

    beforeEach(done => {
      global.createActivity()
        .then(record => {
          activity = record;
          return activity.addPointData(global.mockPointData());
        })
        .then(record => {
          point = record;
          done();
        });
    });

    it('create new point and add to activity', () => {
      expect(point).toEqual(jasmine.objectContaining({
        time: '2016-01-25T08:52:55.000+08:00',
        latitude: '1.282346487045288',
        longitude: '103.84925305843353',
        elevation: '32.72',
        distance: '9033.10418104543',
        heartRate: '142',
      }));
    });
  });
});
