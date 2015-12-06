'use strict'

class UserRoute {

  static create() {
    return new UserRoute()
  }

  paths() {
    return {
      '/users/login': this.login,
      '/users/register': this.register
    }
  }

  login(request, response) {}
  register(request, response) {}

}

module.exports = UserRoute
