'use strict';

const LAP_KEY = 'Lap';
const DURATION_KEY = 'TotalTimeSeconds';
const DISTANCE_KEY = 'DistanceMeters';
const TRACK_KEY = 'Track';

let db = require('./db');
let Sequelize = require('sequelize');

let Point = require('./point');

let Activity = db.define('activity', {
  logId: Sequelize.BIGINT,
  loaded: Sequelize.BOOLEAN,
  distance: Sequelize.DECIMAL(20, 20), // eslint-disable-line new-cap
  duration: Sequelize.BIGINT,
  startTime: Sequelize.TIME,
  type: Sequelize.STRING,
}, {
  classMethods: {
    hashFromXml(xml) {
      let lap;
      let duration;
      let distance;
      let track;

      let activities = xml.root.children[0];
      let activity = activities.children[0];

      activity.children.forEach(item => {
        if (item.name === LAP_KEY) lap = item;
      });

      lap.children.forEach(item => {
        if (item.name === DURATION_KEY) duration = parseInt(item.content, 10);
        if (item.name === DISTANCE_KEY) distance = parseFloat(item.content);
        if (item.name === TRACK_KEY) track = item;
      });

      let tracks = track.children.map(point => Point.hashFromXml(point));

      return {
        type: activity.attributes.Sport,
        startTime: Date.parse(lap.attributes.StartTime),
        duration,
        distance,
        tracks,
      };
    },
  },
  instanceMethods: {
    load(hash, options) {
      return db.transaction(transaction =>
        this.update(Object.assign(hash, { loaded: true }),
          Object.assign({ transaction }, options))
          .then(() =>
            Promise.all(
              hash.tracks.map(point => Point.create(
                point, Object.assign({ transaction }, options))))
          )
          .then(records =>
            Promise.all(records.map(point =>
              this.addPoint(point, Object.assign({ transaction }, options))))
          ));
    },

    json() {
      return {
        id: this.id,
        logID: this.logID,
        groupID: this.groupID,
        distance: this.distance,
        duration: this.duration,
        startTime: this.startTime,
        type: this.type,
      };
    },
  },
});

Activity.hasMany(Point, { as: 'Points' });
Activity.TYPE = {
  RUNNING: 'Running',
};

module.exports = Activity;
