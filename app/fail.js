'use strict'

class Fail {

  constructor(code) {
    this.code = code
  }

}

Fail.ERROR_EMAIL_ALREADY_EXIST = 100
Fail.ERROR_EMAIL_IS_REQUIRED = 101
Fail.ERROR_PASSWORD_IS_REQUIRED = 102

module.exports = Fail
