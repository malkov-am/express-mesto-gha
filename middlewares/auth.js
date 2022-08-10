const { JWT_SECRET = 'very-secret-key' } = process.env;
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(
      new UnauthorizedError({
        message: 'Необходима авторизация.',
      }),
    );
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(
        new UnauthorizedError({
          message: 'Необходима авторизация.',
        }),
      );
    }
    return next(err);
  }
  req.user = payload;
  next();
  return payload;
};
