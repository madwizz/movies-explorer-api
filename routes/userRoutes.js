const userRoutes = require('express').Router();

const {
  getMe,
  updateUserInfo,
} = require('../controllers/user');
const { validateUserInfo } = require('../utils/validators/userValidator');

userRoutes.get('/me', getMe);
userRoutes.patch('/me', validateUserInfo, updateUserInfo);

module.exports = userRoutes;
