'use strict';

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
  mapMeta: Sequelize.TEXT,
}, {
  indexes: [
    {
      unique: true,
      fields: ['logID'],
    },
  ],
  instanceMethods: {
    addPointXML(xml) {
      let hash = Point.hashFromXML(xml);
      return Point.create(hash)
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

module.exports = Activity;
