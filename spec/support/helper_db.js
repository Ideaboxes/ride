'use strict'

let fs = require('fs')
  , databaseUrl = `test.db`

process.env['ENVIRONMENT'] = 'test'
process.env['DATABASE_URL'] = `sqlite://${databaseUrl}`

// Delete specs database url before
try {
  fs.unlinkSync(`${__dirname}/../../${databaseUrl}`)
} catch (e) {
}

let db = require('../../app/models/db')
  , user = require('../../app/models/user')
  , created = false

db.sync({ force: true }).then(function() { created = true })

while (!created) {
  require('deasync').sleep(1000)
}
