class ForbiddenError extends Error {
  constructor(message, ...rest) {
    super(...rest);
    this.status = 403;
    this.message = message;
  }
}

module.exports = ForbiddenError;
