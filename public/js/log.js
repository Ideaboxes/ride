/* eslint-disable no-console */
class Log {
  static instance() {
    if (!Log._instance) {
      Log._instance = new Log;
    }

    return Log._instance;
  }

  log(...args) {
    console.log(...args);
  }

  info(...args) {
    console.info(...args);
  }

  error(...args) {
    console.error(...args);
  }
}

['log', 'info', 'error'].forEach(method => {
  Log[method] = function (...args) {
    let instance = Log.instance();
    instance[method].apply(null, args);
  };
});

export default Log;
