'use strict';

let url = require('url');
let buffer = require('buffer');
let qs = require('querystring');

let Buffer = buffer.Buffer;

let FitbitRoute = require('../../../app/routes/fitbit');

describe('Fitbit Route', () => {
  let route = null;
  let user = null;

  beforeAll(done => {
    process.env.FITBIT_ID = 'fitbit_id';
    process.env.BASE_URL = 'http://localhost:3000';

    route = FitbitRoute.create();
    global.createUserWithServiceName('user@email.com', 'password', 'fitbit')
      .then(record => {
        user = record;
        done();
      });
  });

  afterAll((done) => global.cleanAllData().then(done));

  describe('#link', () => {
    let result = null;

    beforeEach(done => {
      let request = {
        session: { user: {} },
      };
      let response = {
        redirect(code, redirectUrl) {
          let parsedUrl = url.parse(redirectUrl, true);

          result = { code, redirectUrl, parsedUrl };
          done();
        },
      };

      route.link(request, response);
    });

    it('redirects with 302 code', () => {
      expect(result.code).toEqual(302);
    });

    it('redirects to www.fitbit.com', () => {
      expect(result.parsedUrl.hostname).toEqual('www.fitbit.com');
    });

    it('includes required parameters in querystring', () => {
      expect(result.parsedUrl.query).toEqual(jasmine.objectContaining({
        client_id: 'fitbit_id',
        response_type: 'code',
        scope: 'activity heartrate location profile',
        redirect_uri: 'http://localhost:3000/v1/fitbit/callback.json',
        state: jasmine.any(String),
      }));
    });
  });

  describe('#unlink', () => {
    let result = null;

    beforeEach(done => {
      let request = {
        session: { user: user.json() },
      };
      let response = {
        json(data) {
          result = data;
          done();
        },
      };

      route.unlink(request, response);
    });

    it('returns service object after unlink success', () => {
      expect(result).toEqual({
        service: { name: 'fitbit' },
      });
    });
  });

  describe('#callback', () => {
    beforeEach(() => {
      spyOn(route, 'getAccessToken').and.returnValue(Promise.resolve({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      }));
    });

    it('redirects to profile when success', done => {
      let request = {
        query: { code: 'callback_code' },
        session: {
          user: user.json(),
        },
      };
      let response = {
        redirect(status, redirectUrl) {
          expect(status).toEqual(302);
          expect(redirectUrl).toEqual('/#/profile');
          done();
        },
      };

      route.callback(request, response);
    });
  });

  describe('#getAccessToken', () => {
    beforeEach(done => {
      spyOn(route.service, '_request').and.callFake(
        (method, accessTokenUrl, header, post, something, cb) => {
          cb(null, JSON.stringify({
            access_token: 'access_token',
            refresh_token: 'refresh_token',
          }));
        });

      route.getAccessToken('callback_code').then(done);
    });

    it('requests accessToken with fitbit header', () => {
      let authorization = `${process.env.FITBIT_ID}:${process.env.FITBIT_SECRET}`;
      let header = {
        Authorization: `Basic ${new Buffer(authorization).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      let params = {
        code: 'callback_code',
        grant_type: 'authorization_code',
        client_id: process.env.FITBIT_ID,
        redirect_uri: `${process.env.BASE_URL}/v1/fitbit/callback.json`,
      };

      let postData = qs.stringify(params);

      expect(route.service._request).toHaveBeenCalledWith(
        'POST',
        route.service._getAccessTokenUrl(),
        header,
        postData,
        null,
        jasmine.any(Function));
    });
  });
});
