'use strict';

let bcrypt = require('bcrypt');

let User = require('../../app/models/user');
let Service = require('../../app/models/service');

global.createUser = (email, password) =>
  User.create({
    email,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
  });

global.createUserWithService = (email, password) =>
  global.createUser(email, password)
    .then(user =>
      Promise.all([
        Service.create({
          name: 'service_name',
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
          userId: user.id,
        }),
        user]))
    .then(data => Promise.resolve(data[1]));
