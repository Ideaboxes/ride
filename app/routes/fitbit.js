'use strict';

let oauth = require('oauth');

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
    response.json({ ok: true });
  }

}

module.exports = FitbitRoute;
