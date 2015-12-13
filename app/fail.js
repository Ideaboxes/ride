'use strict'

class Fail {

  constructor(code, message) {
    this.code = code
    this.message = message
  }

}

Fail.ERROR_EMAIL_ALREADY_EXIST = 100

module.exports = Fail
