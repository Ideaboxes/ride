'use strict'

let User = require('../models/user')
  , Fail = require('../fail')

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
        request.session.user = user.json()
        response.set('Location', '/')
        response.status(302)
        response.json({ user: user.json() })
      })
      .catch(error => {
        response.set('Location', `/#/login?error=${error.code}`)
        response.status(302)
        response.json({ error: error })
      })
  }

  logout(request, response) {
    request.session.destroy()
    response.redirect(302, '/')
  }

  register(request, response) {
    User.register(request.body)
      .then(user => {
        response.set('Location', '/#/login')
        response.status(302)
        response.json({ user: user.json() })
      })
      .catch(error => {
        response.set('Location', `/#/register?error=${error.code}`)
        response.status(302)
        response.json({ error: error })
      })
  }

  me(request, response) {
    if (request.session.user) return response.json({ user: request.session.user })

    response.status(404)
    response.json({ error: new Fail(Fail.ERROR_NO_USER_FOUND) })
  }

}

module.exports = UserRoute
