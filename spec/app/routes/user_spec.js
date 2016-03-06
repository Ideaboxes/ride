'use strict';

let UserRoute = require('../../../app/routes/user');
let Fail = require('../../../app/fail');

describe('User Route', () => {
  let route = null;
  let user = null;

  beforeAll(done => {
    route = UserRoute.create();

    global.createUserWithService('user@email.com', 'password').then(object => {
      user = object;
      done();
    });
  });

  afterAll((done) => global.cleanAllData().then(done));

  describe('#paths', () => {
    it('returns all path with functions to handle the request', () => {
      expect(route.paths()).toContain({
        path: jasmine.any(String),
        method: jasmine.any(String),
        handler: jasmine.any(Function),
      });
    });
  });

  describe('#register', () => {
    it('returns user object after success register', (done) => {
      let request = {
        body: { email: 'newuser@email.com', password: 'password' },
      };
      let response = {
        status: jasmine.createSpy('status'),
        set: jasmine.createSpy('set'),
        json(data) {
          expect(response.status).toHaveBeenCalledWith(302);
          expect(response.set).toHaveBeenCalledWith('Location', '/#/login');
          expect(data).toEqual({
            user: {
              id: jasmine.any(Number),
              email: 'newuser@email.com',
            },
          });
          done();
        },
      };

      route.register(request, response);
    });

    it('returns error code when user is exists', (done) => {
      let request = {
        body: { email: 'user@email.com', password: 'password' },
      };
      let response = {
        status: jasmine.createSpy('status'),
        set: jasmine.createSpy('set'),
        json(data) {
          expect(response.status).toHaveBeenCalledWith(302);
          expect(response.set).toHaveBeenCalledWith(
            'Location',
            `/#/register?error=${Fail.ERROR_EMAIL_ALREADY_EXIST}`);
          expect(data).toEqual({
            error: new Fail(Fail.ERROR_EMAIL_ALREADY_EXIST),
          });
          done();
        },
      };

      route.register(request, response);
    });
  });

  describe('#login', () => {
    it('returns user object after success login', done => {
      let request = {
        session: {},
        body: { email: 'user@email.com', password: 'password' },
      };
      let response = {
        status: jasmine.createSpy('status'),
        set: jasmine.createSpy('set'),
        json(data) {
          let object = {
            id: jasmine.any(Number),
            email: 'user@email.com',
          };

          expect(request.session.user).toEqual(user.json());
          expect(response.status).toHaveBeenCalledWith(302);
          expect(response.set).toHaveBeenCalledWith('Location', '/');
          expect(data).toEqual({ user: object });
          done();
        },
      };

      route.login(request, response);
    });

    it('returns user is not exist when login fail', done => {
      let request = {
        session: {},
        body: { email: 'nouser@email.com', password: 'password' },
      };
      let response = {
        status: jasmine.createSpy('status'),
        set: jasmine.createSpy('set'),
        json(data) {
          expect(request.session.user).not.toBeDefined();
          expect(response.status).toHaveBeenCalledWith(302);
          expect(response.set).toHaveBeenCalledWith(
            'Location',
            `/#/login?error=${Fail.ERROR_NO_USER_FOUND}`);
          expect(data).toEqual({
            error: new Fail(Fail.ERROR_NO_USER_FOUND),
          });
          done();
        },
      };

      route.login(request, response);
    });

    it('returns invalid password when login fail', done => {
      let request = {
        session: {},
        body: { email: 'user@email.com', password: 'invalidpassword' },
      };
      let response = {
        status: jasmine.createSpy('status'),
        set: jasmine.createSpy('set'),
        json(data) {
          expect(request.session.user).not.toBeDefined();
          expect(response.status).toHaveBeenCalledWith(302);
          expect(response.set).toHaveBeenCalledWith(
            'Location',
            `/#/login?error=${Fail.ERROR_INVALID_PASSWORD}`);
          expect(data).toEqual({
            error: new Fail(Fail.ERROR_INVALID_PASSWORD),
          });
          done();
        },
      };

      route.login(request, response);
    });
  });

  describe('#logout', () => {
    it('destroys session', (done) => {
      let request = {
        session: { destroy: jasmine.createSpy('destroy') },
      };
      let response = {
        redirect(code, path) {
          expect(code).toEqual(302);
          expect(path).toEqual('/');
          expect(request.session.destroy).toHaveBeenCalled();
          done();
        },
      };

      route.logout(request, response);
    });
  });

  describe('#me', () => {
    it('returns user if session is exists', done => {
      let output = user.json();
      output.services = [{ name: 'service_name' }];

      let request = {
        session: {
          user: user.json(),
        },
      };
      let response = {
        json(data) {
          expect(data).toEqual({ user: output });
          done();
        },
      };

      route.me(request, response);
    });
  });
});
