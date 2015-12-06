'use strict'

let db = require('./db')
  , Sequelize = require('sequelize')
  , bcrypt = require('bcrypt')

let User = db.define('User', {
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  confirmHash: Sequelize.STRING
}, {
  classMethods: {
    authenticate(email, password) {
      return User.findOne({
        where: { email: email }
      }).then((user) => {
        return new Promise((resolve, reject) => {
          if (!user) return reject()

          bcrypt.compare(password, user.password, (error, result) => {
            if (result) return resolve()
            reject()
          })
        })
      })
    },

    register(hash) {
      return new Promise((resolve, reject) => {
        reject()
      })
    }
  }
})

module.exports = User
