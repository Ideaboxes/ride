'use strict'

let sqlite3 = require('sqlite3')
  , express = require('express')
  , app = express()

let db = new sqlite3.Database('./data.db')
  , routes = require('./routes')

app.use(express.static('public'))
app.get('/data', (req, res) => {
  res.type('application/json')
  db.serialize(() => {
    res.write('[')
    db.each("select id, latitude, longitude, elevation, time from points", (err, row) => {
      res.write(`{ "id": "${row.id}", "latitude": ${row.latitude}, "longitude": ${row.longitude}, "elevation": ${row.elevation}, "time": "${row.time}"  },`)
    }, () => {
      res.write(`{ "last": true }`)
      res.end(']')
    })
  })
})

console.log (routes)

let server = app.listen(3000, () => {
  let address = server.address()
    , host = address.address
    , port = address.port

  console.info(`Server is started at http://${host}:${port}`)
})
