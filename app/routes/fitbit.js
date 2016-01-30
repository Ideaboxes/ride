'use strict';

// let User = require('../models/user');
// let Fail = require('../fail');

class FitbitRoute {

  static create() {
    return new FitbitRoute();
  }

  paths() {
    return [
      { path: '/fitbit/links', method: 'get', handler: this.link },
    ];
  }

  link(request, response) {
    response.json({ ok: true });
  }

}

module.exports = FitbitRoute;
