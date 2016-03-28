'use strict';

let Activity = require('../../../app/models/activity');

describe('Activity', () => {
  afterAll((done) => global.cleanAllData().then(done));

  fdescribe('#fromXml', () => {
    let activity;
    let points;

    beforeEach(done => {
      Activity.fromXml(global.mockActivityData()).then(record => {
        activity = record;
        return record.getPoints();
      }).then(records => {
        points = records;
        done();
      });
    });

    it('creates activity with all points data', () => {
      expect(activity).toEqual(jasmine.objectContaining({
        logId: '2016-03-28T18:10:19.000+08:00',
        loaded: true,
        distance: 10434.454680960709, // in metres
        duration: 2057, // in seconds
        startTime: 1459159819000,
        type: Activity.TYPE.RUNNING,
      }));
    });

    it('contains two points in activity', () => {
      expect(points.length).toEqual(2);
    });
  });

  describe('#addXmlPoint', () => {
    let activity;
    let points;

    beforeEach(done => {
      global.createActivity()
        .then(record => {
          activity = record;
          return activity.addXmlPoint(global.mockPointData({
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
