'use strict';

let Activity = require('../../../app/models/activity');
let Log = require('../../../app/log');
var parse = require('xml-parser');

describe('Activity', () => {
  afterAll((done) => global.cleanAllData().then(done));

  describe('#hashFromXml', () => {
    let hash;
    beforeEach(() => {
      hash = Activity.hashFromXml(global.mockActivityData());
    });

    it('returns hash with all activity information prepare for create/update', () => {
      expect(hash).toEqual(jasmine.objectContaining({
        distance: 10434.454680960709, // in metres
        duration: 2057, // in seconds
        startTime: 1459159819000,
        type: Activity.TYPE.RUNNING,
        tracks: jasmine.any(Array),
      }));
    });

    it('contains 2 tracks inside', () => {
      expect(hash.tracks.length).toEqual(2);
    });
  });

  describe('#load', () => {
    let activity;
    let points;

    beforeEach(done => {
      Activity.create({ logId: 1 })
      .then(record => record.load(Activity.hashFromXml(global.mockActivityData())))
      .then(() => Activity.findAll())
      .then(records => {
        activity = records[0];
        return activity.getPoints();
      })
      .then(records => {
        points = records;
        done();
      })
      .catch(e => {
        Log.error(e);
        done();
      });
    });

    it('saves all xml data to activity and creates all points', () => {
      expect(activity).toEqual(jasmine.objectContaining({
        logId: 1,
        loaded: true,
        distance: 10434.454680960709, // in metres
        duration: 2057, // in seconds
        startTime: 1459159819000,
        type: Activity.TYPE.RUNNING,
      }));
    });

    it('creates activity points', () => {
      expect(points.length).toEqual(2);
    });
  });
});
