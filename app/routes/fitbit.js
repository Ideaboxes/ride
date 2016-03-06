'use strict';

let oauth = require('oauth');
let buffer = require('buffer');
let qs = require('querystring');

let User = require('../models/user');

let Buffer = buffer.Buffer;

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
      { path: '/fitbit/unlink', method: 'get', handler: this.unlink.bind(this) },
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

  unlink(request, response) {
    User.findById(request.session.user.id)
      .then(user => user.unlinkService('fitbit'))
      .then(service => {
        response.json({ service: service.json() });
      });
  }

  callback(request, response) {
    return Promise.all([
      this.getAccessToken(request.query.code),
      User.findById(request.session.user.id),
    ])
    .then(result => {
      let authorizedToken = result[0];
      let user = result[1];

      return user.linkService('fitbit',
        authorizedToken.access_token,
        authorizedToken.refresh_token);
    })
    .then(() => {
      response.redirect(302, '/#/profile');
    })
    .catch(error => {
      // Need explanation for an error
      console.error(error);
      response.redirect(302, '/#/profile');
    });
  }

  getAccessToken(code) {
    let authorization = `${process.env.FITBIT_ID}:${process.env.FITBIT_SECRET}`;
    let header = {
      Authorization: `Basic ${new Buffer(authorization).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    let params = {
      code,
      grant_type: 'authorization_code',
      client_id: process.env.FITBIT_ID,
      redirect_uri: `${process.env.BASE_URL}/v1/fitbit/callback.json`,
    };

    let postData = qs.stringify(params);
    let service = this.service;
    return new Promise((resolve, reject) => {
      service._request('POST', service._getAccessTokenUrl(), header, postData, null,
        (error, data) => {
          if (error) { return reject(error); }
          return resolve(JSON.parse(data));
        });
    });
  }

}

module.exports = FitbitRoute;
