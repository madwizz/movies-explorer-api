const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../utils/classErrors/BadRequestError');
const MatchedError = require('../utils/classErrors/MatchedError');
const NotFoundError = require('../utils/classErrors/NotFoundError');
const { MONGO_DB_CODE } = require('../utils/errors');
const {
  USER_NOT_FOUND_ERROR,
  USER_ID_VALIDATION_ERROR,
  USER_REGISTERED_ERROR,
  INVALID_DATA_ERROR,
  USER_CREATED_MESSAGE,
} = require('../utils/constants');

const { getJWT } = require('../utils/getJWT');

module.exports.getMe = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findById({ _id: id });
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND_ERROR);
    }
    return res.send(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError(USER_ID_VALIDATION_ERROR));
    }
    return next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      name, email, password: hash,
    });
    res.send(USER_CREATED_MESSAGE);
  } catch (error) {
    if (error.code === MONGO_DB_CODE) {
      next(new MatchedError(USER_REGISTERED_ERROR));
    } else if (error.name === 'ValidationError') {
      next(new BadRequestError(INVALID_DATA_ERROR));
    } else {
      next(error);
    }
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUser(email, password);
    const key = getJWT();
    const token = jwt.sign({ _id: user._id }, key, { expiresIn: '7d' });
    res.send({ token });
  } catch (error) {
    next(error);
  }
};

module.exports.updateUserInfo = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userInfoUpdate = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    res.send(userInfoUpdate);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
};
