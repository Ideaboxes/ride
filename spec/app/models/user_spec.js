'use strict';

let User = require('../../../app/models/user');
let Fail = require('../../../app/fail');

describe('User', () => {
  let user = null;

  beforeAll((done) => {
    global.createUserWithService('user@email.com', 'password')
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
    let newUser = null;

    describe('create success', () => {
      beforeAll(done => {
        User.register({
          email: 'newuser@email.com',
          password: 'password',
        }).then(record => {
          newUser = record;
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
        expect(newUser.password).not.toEqual('password');
      });

      it('set confirmHash', () => {
        expect(newUser.confirmHash).toBeDefined();
        expect(newUser.confirmHash.length).toBeGreaterThan(0);
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
    let newUser = null;

    beforeAll(done => {
      global.createUserWithService('newuser2@email.com', 'password')
        .then(record => {
          newUser = record;
          return newUser.linkService('sample_service', 'sample_token', 'sample_refresh_token');
        })
        .then(record => {
          service = record;
          done();
        });
    });

    it('returns service', () => {
      expect(service).toEqual(jasmine.objectContaining({
        name: 'sample_service',
        accessToken: 'sample_token',
        refreshToken: 'sample_refresh_token',
      }));
    });

    it('returns error when link service with same name', done => {
      newUser.linkService('sample_service', 'sample_token', 'sample_refresh_token')
        .then(() => {
          done.fail('user create duplicated service');
        })
        .catch(() => {
          done();
        });
    });

    it('includes new service in user object', done => {
      newUser.getServices()
        .then(services => {
          expect(services.length).toEqual(2);
          expect(services[1].id).toEqual(service.id);
          done();
        });
    });
  });

  describe('#unlinkService', () => {
    let service = null;
    let newUser = null;

    beforeAll(done => {
      global.createUserWithService('newuser3@email.com', 'password')
        .then(record => {
          newUser = record;
          return newUser.unlinkService('service_name');
        })
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

    it('removes service from user object', done => {
      newUser.getServices()
        .then(services => {
          expect(services.length).toEqual(0);
          done();
        });
    });

    it('returns error when unlink service that is not exist', done => {
      newUser.unlinkService('unknown_service')
        .then(() => {
          done.fail('user unlink unknown service');
        })
        .catch(() => {
          done();
        });
    });
  });

  describe('#addTcxActivity', () => {
    let activities;

    beforeEach(done => {
      user.addTcxActivity(global.mockActivityData())
        .then(() => user.getActivities())
        .then(records => {
          activities = records;
        })
        .then(done);
    });

    it('adds activity to user', () => {
      expect(activities.length).toEqual(1);
    });
  });
});
