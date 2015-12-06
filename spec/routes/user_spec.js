'use strict'

let UserRoute = require('../../routes/user')
  , User = require('../../models/user')

describe('User Route', function() {

  let route = null

  beforeAll(() => {
    route = UserRoute.create()
  })

  describe('#paths', () => {

    it ('returns all path with functions to handle the request', () => {
      expect(route.paths()).toEqual({
        '/users/login': jasmine.any(Function),
        '/users/register': jasmine.any(Function)
      })
    })

  })

})
