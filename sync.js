'use strict';

require('dotenv').load();

let db = require('./app/models/db');
require('./app/models/user');
require('./app/models/service');
require('./app/models/point');
require('./app/models/activity');

db.sync();
