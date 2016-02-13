'use strict';

let fs = require('fs');
let databaseUrl = 'test.db';

process.env.ENVIRONMENT = 'test';
process.env.DATABASE_URL = `sqlite://${databaseUrl}`;

// Delete specs database url before
try {
  fs.unlinkSync(`${__dirname}/../../${databaseUrl}`);
} catch (e) {
  // Don't do anything
}

let db = require('../../app/models/db');
let User = require('../../app/models/user');
let Service = require('../../app/models/service');

let created = false;

db.sync({ force: true }).then(() => { created = true; });

while (!created) {
  require('deasync').sleep(1000);
}

global.cleanAllData = () =>
  Promise.all([User.truncate(),
    Service.truncate()]);
