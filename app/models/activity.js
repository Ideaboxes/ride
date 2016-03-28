'use strict';

let db = require('./db');
let Sequelize = require('sequelize');

let Point = require('./point');

let Activity = db.define('activity', {
  logId: Sequelize.STRING,
  loaded: Sequelize.BOOLEAN,
  distance: Sequelize.DECIMAL(20, 20), // eslint-disable-line new-cap
  duration: Sequelize.BIGINT,
  startTime: Sequelize.TIME,
  type: Sequelize.STRING,
}, {
  classMethods: {
    fromXml() {
      return Activity.create();
    },
  },
  instanceMethods: {
    addXmlPoint(xml) {
      return Point.fromXml(xml)
        .then(point => this.addPoint(point));
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
Activity.TYPE_RIDE = 'ride';

module.exports = Activity;
