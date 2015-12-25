'use strict'

let bcrypt = require('bcrypt')

let UserRoute = require('../../../app/routes/user')
  , User = require('../../../app/models/user')
  , Fail = require('../../../app/fail')

describe('User Route', function() {

  let route = null

  beforeAll(done => {
    route = UserRoute.create()

    User.create({
      email: 'user@email.com',
      password: bcrypt.hashSync('password', bcrypt.genSaltSync())
    }).then(done)
  })

  afterAll(done => {
    User.truncate().then(done)
  })

  describe('#paths', () => {

    it ('returns all path with functions to handle the request', () => {
      expect(route.paths()).toEqual([
        { path: '/users/login', method: 'post', handler: jasmine.any(Function) },
        { path: '/users/register', method: 'post', handler: jasmine.any(Function) },
      ])
    })

  })

  describe('#register', () => {

    it ('returns user object after success register', (done) => {
      let statusCode
      let request = {
        body: { email: 'newuser@email.com', password: 'password' }
      }, response = {
        status: jasmine.createSpy('status'),
        set: jasmine.createSpy('set'),
        json(data) {
          expect(response.status).toHaveBeenCalledWith(302)
          expect(response.set).toHaveBeenCalledWith('Location', '/#/login')
          expect(data).toEqual({
            user: {
              id: jasmine.any(Number),
              email: 'newuser@email.com'
            }
          })
          done()
        }
      }

      route.register(request, response)
    })

    it ('returns error code when user is exists', (done) => {
      let request = {
        body: { email: 'user@email.com', password: 'password' }
      }, response = {
        status: jasmine.createSpy('status'),
        set: jasmine.createSpy('set'),
        json(data) {
          expect(response.status).toHaveBeenCalledWith(302)
          expect(response.set).toHaveBeenCalledWith('Location', `/#/register?error=${Fail.ERROR_EMAIL_ALREADY_EXIST}`)
          expect(data).toEqual({
            error: new Fail(Fail.ERROR_EMAIL_ALREADY_EXIST)
          })
          done()
        }
      }

      route.register(request, response)
    })

  })

  describe('#login', () => {

    it ('returns user object after success login', done => {
      let request = {
        session: {},
        body: { email: 'user@email.com', password: 'password' }
      }, response = {
        status: jasmine.createSpy('status'),
        set: jasmine.createSpy('set'),
        json(data) {
          let user = {
            user: {
              id: jasmine.any(Number),
              email: 'user@email.com'
            }
          }

          expect(request.session.user).toEqual(user)
          expect(response.status).toHaveBeenCalledWith(302)
          expect(response.set).toHaveBeenCalledWith('Location', '/')
          expect(data).toEqual(user)
          done()
        }
      }

      route.login(request, response)
    })

    it ('returns user is not exist when login fail', done => {
      let request = {
        session: {},
        body: { email: 'nouser@email.com', password: 'password' }
      }, response = {
        status: jasmine.createSpy('status'),
        set: jasmine.createSpy('set'),
        json(data) {
          expect(request.session.user).not.toBeDefined()
          expect(response.status).toHaveBeenCalledWith(302)
          expect(response.set).toHaveBeenCalledWith('Location', `/#/login?error=${Fail.ERROR_NO_USER_FOUND}`)
          expect(data).toEqual({
            error: new Fail(Fail.ERROR_NO_USER_FOUND)
          })
          done()
        }
      }

      route.login(request, response)
    })

    it ('returns invalid password when login fail', done => {
      let request = {
        session: {},
        body: { email: 'user@email.com', password: 'invalidpassword' }
      }, response = {
        status: jasmine.createSpy('status'),
        set: jasmine.createSpy('set'),
        json(data) {
          expect(request.session.user).not.toBeDefined()
          expect(response.status).toHaveBeenCalledWith(302)
          expect(response.set).toHaveBeenCalledWith('Location', `/#/login?error=${Fail.ERROR_INVALID_PASSWORD}`)
          expect(data).toEqual({
            error: new Fail(Fail.ERROR_INVALID_PASSWORD)
          })
          done()
        }
      }

      route.login(request, response)
    })

  })

})
