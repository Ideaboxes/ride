'use strict'

let User = require('../models/user')

class UserRoute {

  static create() {
    return new UserRoute()
  }

  paths() {
    return [
      { path: '/users/login', method: 'post', handler: this.login },
      { path: '/users/register', method: 'post', handler: this.register }
    ]
  }

  login(request, response) {
    User.authenticate(request.body.email, request.body.password)
      .then(user => {
        response.json({ user: user.json() })
      })
      .catch(error => {
        response.json({ error: error })
      })
  }

  register(request, response) {
    User.register(request.body)
      .then(user => {
        response.json({ user: user.json() })
      })
      .catch(error => {
        response.json({ error: error })
      })
  }

}

module.exports = UserRoute
