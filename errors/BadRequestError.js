class BadRequestError extends Error {
  constructor(message, ...rest) {
    super(...rest);
    this.status = 400;
    this.message = message;
  }
}

module.exports = BadRequestError;
