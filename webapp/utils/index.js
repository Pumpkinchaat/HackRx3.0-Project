/**
 * This file contains the utilities to handle general error
 * and error in async code
 */

class ExpressError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

const catchAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};

module.exports = {
  catchAsync,
  ExpressError,
};
