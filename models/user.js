const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../utils/classErrors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: () => 'Email is incorrect',
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
    return Promise.reject(new UnauthorizedError('Wrong email: this email does not exist'));
  }

  try {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedError('Wrong password');
    }
  } catch (error) {
    return Promise.reject(new UnauthorizedError('Wrong password'));
  }
  return user;
};

module.exports = mongoose.model('user', userSchema);
