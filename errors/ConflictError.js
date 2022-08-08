class ConflictError extends Error {
  constructor(message, ...rest) {
    super(...rest);
    this.status = 409;
    this.message = message;
  }
}

module.exports = ConflictError;
