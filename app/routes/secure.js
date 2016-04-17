'use strict';

let Fail = require('../fail');

class SecureRoute {
  static create() {
    return new SecureRoute();
  }

  paths() {
    return [
      '/users/logout',
      '/users/me',
      '/users/activities',
      '/fitbit/*',
    ].map(path => ({ path, method: 'all', handler: this.requiredUser.bind(this) }));
  }

  requiredUser(request, response, next) {
    if (!request.session.user) {
      response.status(403);
      response.json({ error: new Fail(Fail.ERROR_FORBIDDEN) });
      return undefined;
    }
    return next();
  }
}

module.exports = SecureRoute;
