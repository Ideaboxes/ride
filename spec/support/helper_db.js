'use strict';

let fs = require('fs');
let databaseUrl = `test.db`;

process.env.ENVIRONMENT = 'test';
process.env.DATABASE_URL = `sqlite://${databaseUrl}`;

// Delete specs database url before
try {
  fs.unlinkSync(`${__dirname}/../../${databaseUrl}`);
} catch (e) {
  // Don't do anything
}

let db = require('../../app/models/db');
require('../../app/models/user');
let created = false;

db.sync({ force: true }).then(() => { created = true; });

while (!created) {
  require('deasync').sleep(1000);
}
