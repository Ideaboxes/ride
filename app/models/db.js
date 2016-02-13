 'use strict';

let Sequelize = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL, { logging: null });
module.exports = db;
