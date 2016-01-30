'use strict';

require('dotenv').load();

let db = require('./app/models/db');
require('./app/models/user');

db.sync();
