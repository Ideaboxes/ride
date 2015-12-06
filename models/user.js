'use strict'

let db = require('./db')
  , Sequelize = require('sequelize')
  , bcrypt = require('bcrypt')

let User = db.define('User', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
}, {
  classMethods: {
    authenticate(username, password) {
      return User.findOne({
        where: { username: username }
      }).then((user) => {
        return new Promise((resolve, reject) => {
          if (!user) return reject()

          bcrypt.compare(password, user.password, (error, result) => {
            if (result) return resolve()
            reject()
          })
        })
      })
    }
  }
})

module.exports = User
