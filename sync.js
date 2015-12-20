'use strict'

require('dotenv').load()

let db = require('./app/models/db')
  , user = require('./app/models/user')

db.sync()
