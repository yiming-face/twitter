'use strict';

const {Code} = require('./code');

/**
 * Common result representation
 */
class Result {
  constructor(code, data = {}) {
    this.data = {};
    this.code = code;
    this.message = Code.toString(code);
    this.data = data;
  }

  isSuccess() {
    return this.code === Code.OK;
  }

  isFail() {
    return !this.isSuccess();
  }

  static success(data = {}) {
    return new Result(Code.OK, data);
  }

  static error(code, data = {}) {
    const result = new Result(code);
    if (typeof data === 'string' && data.length > 0) {
      result.message = data;
    } else {
      result.data = data;
    }
    return result;
  }
}

module.exports = {
  Result
};
