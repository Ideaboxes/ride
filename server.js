'use strict'

require('dotenv').load()

let sqlite3 = require('sqlite3')
  , express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , session = require('express-session')

let db = new sqlite3.Database('./data.db')
  , routes = require('./app/routes')

app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 360000 } }))
app.use(express.static('public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

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

Object.keys(routes).forEach(module => {
  let route = routes[module].create()
    , paths = route.paths()
  paths.forEach(path => {
    app[path.method](path.path, path.handler)
  })
})

let server = app.listen(3000, () => {
  let address = server.address()
    , host = address.address
    , port = address.port

  console.info(`Server is started at http://${host}:${port}`)
})
