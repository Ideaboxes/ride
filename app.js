'use strict'

let sqlite3 = require('sqlite3')
  , express = require('express')
  , app = express()

app.use(express.static('public'))

let server = app.listen(3000, () => {
  let address = server.address()
    , host = address.address
    , port = address.port

  console.info(`Server is started at http://${host}:${port}`)
})