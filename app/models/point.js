'use strict';

const TIME_KEY = 'Time';
const ALTITUDE_METERS_KEY = 'AltitudeMeters';
const DISTANCE_METERS_KEY = 'DistanceMeters';
const HEARTRATE_KEY = 'HeartRateBpm';
const LATITUDE_DEGREES_KEY = 'LatitudeDegrees';
const LONGITUDE_DEGREE_KEY = 'LongitudeDegrees';
const POSITION_KEY = 'Position';

const XML_KEY = {
  Time: 'time',
  AltitudeMeters: 'elevation',
  DistanceMeters: 'distance',
  HeartRateBpm: 'heartRate',
  LatitudeDegrees: 'latitude',
  LongitudeDegrees: 'longitude',
};

let db = require('./db');
let Sequelize = require('sequelize');

let Point = db.define('point', {
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT,
  elevation: Sequelize.FLOAT,
  heartRate: Sequelize.INTEGER,
  time: Sequelize.TIME,
  distance: Sequelize.DECIMAL(20, 20), // eslint-disable-line new-cap
}, {
  classMethods: {
    hashFromXML(xml) {
      let hash = {};
      xml.children.forEach(child => {
        switch (child.name) {
          case HEARTRATE_KEY:
            hash[XML_KEY[child.name]] = Number(child.children[0].content);
            break;
          case POSITION_KEY:
            child.children.forEach(position => {
              hash[XML_KEY[position.name]] = Number(position.content);
            });
            break;
          case TIME_KEY:
            hash[XML_KEY[TIME_KEY]] = Date.parse(child.content);
            break;
          default:
            hash[XML_KEY[child.name]] = Number(child.content);
        }
      });
      return hash;
    },
  },

  instanceMethods: {
    json() {
      return {
        id: this.id,
        latitude: this.latitude,
        longitude: this.longitude,
        elevation: this.elevation,
        heartRate: this.heartRate,
        time: this.time,
        distance: this.distance,
      };
    },
  },
});

Point.TIME_KEY = TIME_KEY;
Point.ALTITUDE_METERS_KEY = ALTITUDE_METERS_KEY;
Point.DISTANCE_METERS_KEY = DISTANCE_METERS_KEY;
Point.HEARTRATE_KEY = HEARTRATE_KEY;
Point.LATITUDE_DEGREES_KEY = LATITUDE_DEGREES_KEY;
Point.LONGITUDE_DEGREE_KEY = LONGITUDE_DEGREE_KEY;
Point.POSITION_KEY = POSITION_KEY;
Point.XML_KEY = XML_KEY;

module.exports = Point;
