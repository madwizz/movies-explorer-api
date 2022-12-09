const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../utils/classErrors/UnauthorizedError');
const {
  INVALID_DATA_ERROR,
  INVALID_EMAIL,
  INVALID_PASSWORD,
} = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: () => `${INVALID_DATA_ERROR}`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUser = async function (email, password) {
  let user;

  try {
    user = await this.findOne({ email }).select('+password');
  } catch (error) {
    return Promise.reject(new UnauthorizedError(INVALID_EMAIL));
  }

  try {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedError(INVALID_PASSWORD);
    }
  } catch (error) {
    return Promise.reject(new UnauthorizedError(INVALID_PASSWORD));
  }
  return user;
};

module.exports = mongoose.model('user', userSchema);
