const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError({
      message: 'Необходима авторизация.',
    });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, '24abcbc149fe562f21cb9a885e08109f84524c2504cc38a1d3b6d27e4c0492d1');
  } catch (err) {
    throw new UnauthorizedError({
      message: 'Необходима авторизация.',
    });
  }
  req.user = payload;
  next();
  return payload;
};
