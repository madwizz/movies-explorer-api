const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/classErrors/UnauthorizedError');
const { getJWT } = require('../utils/getJWT');

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new UnauthorizedError('Authorization is required'));
    }
    const key = getJWT();
    payload = jwt.verify(token, key);
  } catch (err) {
    return next(new UnauthorizedError('Authorization is required'));
  }
  req.user = payload;
  return next();
};
