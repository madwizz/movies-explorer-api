const userRoutes = require('express').Router();

const {
  getMe,
  updateUserInfo,
} = require('../controllers/user');
const { validateUserInfo } = require('../utils/validators/userValidator');

userRoutes.get('/users/me', getMe);
userRoutes.patch('/users/me', validateUserInfo, updateUserInfo);

module.exports = userRoutes;
