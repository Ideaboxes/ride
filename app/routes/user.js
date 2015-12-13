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
    response.json({ success: true })
  }

  register(request, response) {
    User.register(request.body)
      .then(user => {
        console.log ('user', user)
        response.json({ success: true })
      })
      .catch(error => {
        console.log ('error', error)
        response.json({ success: false })
      })
  }

}

module.exports = UserRoute
