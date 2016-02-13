'use strict';

let User = require('../../../app/models/user');
let Fail = require('../../../app/fail');

describe('User', () => {
  let user = null;

  beforeAll((done) => {
    global.createUser('user@email.com', 'password')
      .then(record => {
        user = record;
        done();
      });
  });

  afterAll((done) => global.cleanAllData().then(done));

  describe('#json', () => {
    it('returns only id and email', () => {
      expect(user.json()).toEqual({
        id: jasmine.any(Number),
        email: 'user@email.com',
      });
    });
  });

  describe('#authenticate', () => {
    it('resolves when authenticate success', (done) => {
      User.authenticate('user@email.com', 'password')
        .then(result => {
          expect(result).toBeDefined();
          done();
        })
        .catch(done.fail);
    });

    it('rejects when authenticate fail', (done) => {
      User.authenticate('user@email.com', 'notpassword')
        .then(done.fail)
        .catch(done);
    });

    it('rejects when user is not found', (done) => {
      User.authenticate('notfound@email.com', 'password')
        .then(done.fail)
        .catch(done);
    });
  });

  describe('#register', () => {
    describe('create success', () => {
      beforeAll(done => {
        User.register({
          email: 'newuser@email.com',
          password: 'password',
        }).then(record => {
          user = record;
          done();
        });
      });

      it('increase user count', done => {
        User.count().then(total => {
          expect(total).toEqual(2);
          done();
        });
      });

      it('hash password', () => {
        expect(user.password).not.toEqual('password');
      });

      it('set confirmHash', () => {
        expect(user.confirmHash).toBeDefined();
        expect(user.confirmHash.length).toBeGreaterThan(0);
      });
    });

    it('rejects when email is already exists', (done) => {
      User.register({
        email: 'user@email.com',
        password: 'password',
      })
      .then(done.fail)
      .catch(error => {
        expect(error).toEqual(new Fail(Fail.ERROR_EMAIL_ALREADY_EXIST));
        done();
      });
    });
  });

  describe('#linkService', () => {
    let service = null;

    beforeAll(done => {
      user.linkService('service_name', 'access_token', 'refresh_token')
        .then(record => {
          service = record;
          done();
        });
    });

    it('returns service', () => {
      expect(service).toEqual(jasmine.objectContaining({
        name: 'service_name',
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      }));
    });

    it('returns error when link service with same name', done => {
      user.linkService('service_name', 'access_token', 'refresh_token')
        .then(() => {
          done.fail('user create duplicated service');
        })
        .catch(() => {
          done();
        });
    });

    it('includes new service in user object', done => {
      user.getServices()
        .then(services => {
          expect(services.length).toEqual(1);
          expect(services[0].id).toEqual(service.id);
          done();
        });
    });
  });
});
