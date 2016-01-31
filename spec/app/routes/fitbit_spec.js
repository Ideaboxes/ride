'use strict';

let url = require('url');

let FitbitRoute = require('../../../app/routes/fitbit');

describe('Fitbit Route', () => {
  let route = null;

  beforeAll(() => {
    process.env.FITBIT_ID = 'fitbit_id';
    process.env.BASE_URL = 'http://localhost:3000';

    route = FitbitRoute.create();
  });

  describe('#link', () => {
    let result = null;

    beforeEach(done => {
      let request = {};
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

  // describe('#callback', () => {
  //   beforeEach(() => {
  //     let request = {};
  //     let response = {};
  //   });
  // });
});
