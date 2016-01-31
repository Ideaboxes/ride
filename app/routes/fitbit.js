'use strict';

let oauth = require('oauth');
let buffer = require('buffer');
let qs = require('querystring');

let Buffer = buffer.Buffer;

// let User = require('../models/user');
// let Fail = require('../fail');

class FitbitRoute {

  static create() {
    return new FitbitRoute();
  }

  constructor() {
    this.service = new oauth.OAuth2(
      process.env.FITBIT_ID,
      process.env.FITBIT_SECRET,
      'https://api.fitbit.com/',
      'oauth2/authorize',
      'oauth2/token');
  }

  paths() {
    return [
      { path: '/fitbit/link', method: 'get', handler: this.link.bind(this) },
      { path: '/fitbit/callback', method: 'get', handler: this.callback.bind(this) },
    ];
  }

  link(request, response) {
    let url = this.service.getAuthorizeUrl({
      response_type: 'code',
      scope: ['activity', 'heartrate', 'location', 'profile'].join(' '),
      redirect_uri: `${process.env.BASE_URL}/v1/fitbit/callback.json`,
      state: new Date().getTime(), // TODO: store this in session
    });
    response.redirect(302, url.replace('api.fitbit.com', 'www.fitbit.com'));
  }

  callback(request, response) {
    let authorization = `${process.env.FITBIT_ID}:${process.env.FITBIT_SECRET}`;
    let header = {
      Authorization: `Basic ${new Buffer(authorization).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    let params = {
      code: request.query.code,
      grant_type: 'authorization_code',
      client_id: process.env.FITBIT_ID,
      redirect_uri: `${process.env.BASE_URL}/v1/fitbit/callback.json`,
    };

    let postData = qs.stringify(params);
    let service = this.service;
    service._request('POST', service._getAccessTokenUrl(), header, postData, null,
      (error, data) => {
        if (error) {
          return response.json(error);
        }

        console.log(JSON.parse(data));
        response.json({ ok: true });
      });
  }

}

module.exports = FitbitRoute;
