'use strict';

let db = require('./db');
let Sequelize = require('sequelize');
let bcrypt = require('bcrypt');
let crypto = require('crypto');

let Fail = require('../fail');
let Service = require('./service');

let User = db.define('user', {
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  confirmHash: Sequelize.STRING,
}, {
  classMethods: {
    authenticate(email, password) {
      return User.findOne({
        where: { email },
      }).then((user) => {
        if (!user) return Promise.reject(new Fail(Fail.ERROR_NO_USER_FOUND));

        return new Promise((resolve, reject) => {
          bcrypt.compare(password, user.password, (error, result) => {
            if (result) return resolve(user);
            reject(new Fail(Fail.ERROR_INVALID_PASSWORD));
          });
        });
      });
    },

    register(hash) {
      if (!hash) return Promise.reject('Register requires arguments');
      if (!hash.email) return Promise.reject(new Fail(Fail.ERROR_EMAIL_IS_REQUIRED));
      if (!hash.password) return Promise.reject(new Fail(Fail.ERROR_PASSWORD_IS_REQUIRED));

      return User.findOne({
        where: { email: hash.email },
      }).then(user => {
        if (user) return Promise.reject(new Fail(Fail.ERROR_EMAIL_ALREADY_EXIST));

        return new Promise((resolve, reject) => {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) return reject(err);
            resolve(salt);
          });
        });
      }).then(salt => (
        new Promise((resolve, reject) => {
          bcrypt.hash(hash.password, salt, (err, password) => {
            if (err) return reject(err);
            resolve(password);
          });
        })
      )).then(password => {
        let md5 = crypto.createHash('md5');
        md5.update(password);

        let finalHash = Object.assign({}, hash, {
          password,
          confirmHash: md5.digest('hex'),
        });

        return User.create(finalHash);
      });
    },
  },
  instanceMethods: {
    json() {
      return {
        id: this.id,
        email: this.email,
      };
    },
  },
});

User.hasMany(Service, { as: 'Services' });

module.exports = User;
