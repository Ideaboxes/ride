/* eslint-disable prefer-rest-params, no-console */
'use strict';

class Log {
  static instance() {
    if (!Log._instance) {
      Log._instance = new Log;
    }

    return Log._instance;
  }

  log() {
    console.log.apply(null, arguments);
  }

  info() {
    console.info.apply(null, arguments);
  }

  error() {
    console.error.apply(null, arguments);
  }
}

['log', 'info', 'error'].forEach(method => {
  Log[method] = function () {
    let instance = Log.instance();
    instance[method].apply(null, arguments);
  };
});

module.exports = Log;
