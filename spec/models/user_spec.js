'use strict'

let bcrypt = require('bcrypt')

let User = require('../../models/user')

describe('User', function() {

  describe('#authenticate', () => {

    let user = null

    beforeAll((done) => {
      User.create({
        username: 'user',
        password: bcrypt.hashSync('password', bcrypt.genSaltSync())
      }).then((record) => {
        user = record
        done()
      })
    })

    afterAll((done) => {
      user.destroy().then(done)
    })

    it ('resolves when authenticate success', (done) => {
      User.authenticate('user', 'password')
        .then(done)
        .catch(done.fail)
    })

    it ('rejects when authenticate fail', (done) => {
      User.authenticate('user', 'notpassword')
        .then(done.fail)
        .catch(done)
    })

    it ('rejects when user is not found', (done) => {
      User.authenticate('notfound', 'password')
        .then(done.fail)
        .catch(done)
    })

  })

})
