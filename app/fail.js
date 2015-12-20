'use strict'

class Fail {

  constructor(code) {
    this.code = code
  }

}

Fail.ERROR_EMAIL_ALREADY_EXIST = 1000
Fail.ERROR_EMAIL_IS_REQUIRED = 1001
Fail.ERROR_PASSWORD_IS_REQUIRED = 1002
Fail.ERROR_NO_USER_FOUND = 1003
Fail.ERROR_INVALID_PASSWORD = 1004

module.exports = Fail
