'use strict'

let bcrypt = require('bcrypt')

let UserRoute = require('../../../app/routes/user')
  , User = require('../../../app/models/user')
  , Fail = require('../../../app/fail')

describe('User Route', function() {

  let route = null

  beforeAll(() => {
    route = UserRoute.create()
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

    beforeAll((done) => {
      User.create({
        email: 'user@email.com',
        password: bcrypt.hashSync('password', bcrypt.genSaltSync())
      }).then(done)
    })

    afterAll((done) => {
      User.truncate().then(done)
    })

    it ('returns user object after success register', (done) => {
      let request = {
        body: { email: 'newuser@email.com', password: 'password' }
      }, response = {
        json(data) {
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

    it ('returns error message when user is exists', (done) => {
      let request = {
        body: { email: 'user@email.com', password: 'password' }
      }, response = {
        json(data) {
          expect(data).toEqual({
            error: new Fail(Fail.ERROR_EMAIL_ALREADY_EXIST)
          })
          done()
        }
      }

      route.register(request, response)
    })

  })

})
