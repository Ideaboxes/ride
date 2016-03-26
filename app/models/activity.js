'use strict';

let db = require('./db');
let Sequelize = require('sequelize');

let Point = require('./point');

let Activity = db.define('activity', {
  logID: Sequelize.BIGINT,
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
