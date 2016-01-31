'use strict';

let db = require('./db');
let Sequelize = require('sequelize');

let Service = db.define('service', {
  name: Sequelize.STRING,
  accessToken: Sequelize.STRING,
  refreshToken: Sequelize.STRING,
}, {
  classMethods: {},
  instanceMethods: {
    json() {
      return {
        name: this.name,
      };
    },
  },
});

module.exports = Service;
