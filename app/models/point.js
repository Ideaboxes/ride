'use strict';

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
  instanceMethods: {
    json() {
      return {
        id: this.id,
      };
    },
  },
});

module.exports = Point;
