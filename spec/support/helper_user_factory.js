'use strict';

let bcrypt = require('bcrypt');

let User = require('../../app/models/user');
let Service = require('../../app/models/service');

global.createUser = (email, password) =>
  User.create({
    email,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
  });

global.createUserWithServiceName = (email, password, serviceName) =>
  global.createUser(email, password)
    .then(user =>
      Promise.all([
        Service.create({
          name: serviceName,
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
          userId: user.id,
        }),
        user]))
    .then(data => Promise.resolve(data[1]));

global.createUserWithService = (email, password) =>
  global.createUserWithServiceName(email, password, 'service_name');
