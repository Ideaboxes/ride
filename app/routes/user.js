'use strict'

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
    response.json({ success: true })
  }

}

module.exports = UserRoute
