const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/classErrors/UnauthorizedError');
const [
  AUTH_REQUIRED,
] = require('../utils/constants');
const { getJWT } = require('../utils/getJWT');

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new UnauthorizedError(AUTH_REQUIRED));
    }
    const key = getJWT();
    payload = jwt.verify(token, key);
  } catch (err) {
    return next(new UnauthorizedError(AUTH_REQUIRED));
  }
  req.user = payload;
  return next();
};
