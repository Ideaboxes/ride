'use strict';

let db = require('./db');
let Sequelize = require('sequelize');

let Point = require('./point');

const POINT_TIME_KEY = 'Time'; //eslint-disable-line
const POINT_ALTITUDE_METERS_KEY = 'AltitudeMeters'; //eslint-disable-line
const POINT_DISTANCE_METERS_KEY = 'DistanceMeters'; //eslint-disable-line
const POINT_HEARTRATE_KEY = 'HeartRateBpm'; //eslint-disable-line
const POINT_LATITUDE_DEGREES_KEY = 'LatitudeDegrees'; //eslint-disable-line
const POINT_LONGITUDE_DEGREE_KEY = 'LongitudeDegrees'; //eslint-disable-line
const POINT_POSITION_KEY = 'Position'; //eslint-disable-line

const POINT_XML_KEY = {
  Time: 'time',
  AltitudeMeters: 'elevation',
  DistanceMeters: 'distance',
  HeartRateBpm: 'heartRate',
  LatitudeDegrees: 'latitude',
  LongitudeDegrees: 'longitude',
};

let Activity = db.define('activity', {
  logId: Sequelize.BIGINT,
  loaded: Sequelize.BOOLEAN,
  distance: Sequelize.DECIMAL(20, 20), // eslint-disable-line new-cap
  duration: Sequelize.BIGINT,
  startTime: Sequelize.TIME,
  type: Sequelize.STRING,
  mapMeta: Sequelize.TEXT,
}, {
  indexes: [
    {
      unique: true,
      fields: ['logID'],
    },
  ],
  instanceMethods: {
    addPointData(point) {
      let hash = {};
      point.children.forEach(child => {
        switch (child.name) {
          case POINT_HEARTRATE_KEY:
            hash[POINT_XML_KEY[child.name]] = child.children[0].content;
            break;
          case POINT_POSITION_KEY:
            child.children.forEach(position => {
              hash[POINT_XML_KEY[position.name]] = position.content;
            });
            break;
          default:
            hash[POINT_XML_KEY[child.name]] = child.content;
        }
      });
      return Point.create(hash);
    },

    json() {
      return {
        id: this.id,
        logID: this.logID,
        groupID: this.groupID,
        distance: this.distance,
        duration: this.duration,
      };
    },
  },
});

Activity.hasMany(Point, { as: 'Points' });

module.exports = Activity;
