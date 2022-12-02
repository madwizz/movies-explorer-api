const { NODE_ENV, SECRET_JWT } = process.env;

module.exports.getJWT = function () {
  return NODE_ENV === 'production' ? SECRET_JWT : 'dev-secret';
};
