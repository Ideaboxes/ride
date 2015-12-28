'use strict'

require('dotenv').load()

let express = require('express')
  , bodyParser = require('body-parser')
  , session = require('express-session')

let routes = require('./app/routes')

let app = express()
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 360000 } }))
app.use(express.static('public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

Object.keys(routes).forEach(module => {
  let route = routes[module].create()
    , paths = route.paths()
  paths.forEach(path => {
    // Prefix and suffix all paths
    app[path.method]('/v1' + path.path + '.json', path.handler)
  })
})

let server = app.listen(3000, () => {
  let address = server.address()
    , host = address.address
    , port = address.port

  console.info(`Server is started at http://${host}:${port}`)
})
