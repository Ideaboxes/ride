'use strict';

let bcrypt = require('bcrypt');

let User = require('../../app/models/user');

global.createUser = (email, password) =>
  User.create({
    email,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
  });
