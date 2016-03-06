'use strict';

let SecureRoute = require('../../../app/routes/secure');
let Fail = require('../../../app/fail');

describe('Secure Route', () => {
  let route = null;
  let user = null;

  beforeAll(done => {
    route = SecureRoute.create();

    global.createUserWithService('user@email.com', 'password').then(object => {
      user = object;
      done();
    });
  });

  afterAll((done) => global.cleanAllData().then(done));

  describe('#requiredUser', () => {
    it('calls next when user is exist', () => {
      let request = {
        session: {
          user: user.json(),
        },
      };
      let response = {};
      let next = jasmine.createSpy('next');

      route.requiredUser(request, response, next);
      expect(next).toHaveBeenCalled();
    });

    it('returns error when no user', done => {
      let request = {
        session: {},
      };
      let response = {
        status: jasmine.createSpy('status'),
        json(data) {
          expect(response.status).toHaveBeenCalledWith(403);
          expect(data).toEqual({
            error: new Fail(Fail.ERROR_FORBIDDEN),
          });
          done();
        },
      };
      let next = jasmine.createSpy('next');

      route.requiredUser(request, response, next);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
