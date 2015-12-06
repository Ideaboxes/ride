'use strict'

let bcrypt = require('bcrypt')

let User = require('../../../app/models/user')

describe('User', function() {

  let user = null

  beforeAll((done) => {
    User.create({
      email: 'user@email.com',
      password: bcrypt.hashSync('password', bcrypt.genSaltSync())
    }).then((record) => {
      user = record
      done()
    })
  })

  afterAll((done) => {
    user.destroy().then(done)
  })

  describe('#authenticate', () => {

    it ('resolves when authenticate success', (done) => {
      User.authenticate('user@email.com', 'password')
        .then(done)
        .catch(done.fail)
    })

    it ('rejects when authenticate fail', (done) => {
      User.authenticate('user@email.com', 'notpassword')
        .then(done.fail)
        .catch(done)
    })

    it ('rejects when user is not found', (done) => {
      User.authenticate('notfound@email.com', 'password')
        .then(done.fail)
        .catch(done)
    })

  })

  describe('#register', () => {

    describe('create success', () => {

      let user = null

      beforeAll(done => {
        User.register({
          email: 'newuser@email.com',
          password: 'password'
        }).then(record => {
          user = record
          done()
        })
      })

      it ('increase user count', done => {
        User.count().then(total => {
          expect(total).toEqual(2)
          done()
        })
      })

      it ('hash password', () => {
        expect(user.password).not.toEqual('password')
      })

      it ('set confirmHash', () => {
        expect(user.confirmHash).toBeDefined()
        expect(user.confirmHash.length).toBeGreaterThan(0)
      })

    })

    it ('rejects when email is already exists', (done) => {
      User.register({
        email: 'user@email.com',
        password: 'password'
      })
      .then(done.fail)
      .catch(done)
    })

  })

})
