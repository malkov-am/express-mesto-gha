class UnauthorizedError extends Error {
  constructor({ message }) {
    super(message);
    this.status = 401;
    this.message = message;
  }
}

module.exports = UnauthorizedError;
