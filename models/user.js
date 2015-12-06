'use strict'

let db = require('./db')
  , Sequelize = require('sequelize')
  , bcrypt = require('bcrypt')
  , crypto = require('crypto')

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
        if (!user) return Promise.reject('User is not found')

        return new Promise((resolve, reject) => {
          bcrypt.compare(password, user.password, (error, result) => {
            if (result) return resolve()
            reject('Invalid password')
          })
        })
      })
    },

    register(hash) {
      if (!hash) return Promise.reject('Register requires arguments')
      if (!hash.email) return Promise.reject('Email is required')
      if (!hash.password) return Promise.reject('Password is required')

      return User.findOne({
        where: { email: hash.email }
      }).then(user => {
        if (user) return Promise.reject('Email is already exist')
        return new Promise((resolve, reject) => {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) return reject(err)
            resolve(salt)
          })
        })
      }).then(salt => {
        return new Promise((resolve, reject) => {
          bcrypt.hash(hash.password, salt, (err, password) => {
            if (err) return reject(err)
            resolve(password)
          })
        })
      }).then(password => {
        let md5 = crypto.createHash('md5')
        md5.update(password)

        let finalHash = Object.assign({}, hash, {
          password: password,
          confirmHash: md5.digest('hex')
        })

        return User.create(finalHash)
      })

    }
  }
})

module.exports = User
