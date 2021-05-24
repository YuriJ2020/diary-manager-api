const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const mongoose = require("mongoose");

const createValidator = require("./utils");

const jwtSchema = Joi.object({
  email: Joi.string().email().min(3).max(100).required(),
  nickname: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(3).max(1024).required(),
  iat: Joi.number().required(),
  exp: Joi.number().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().min(3).max(100).required(),
  password: Joi.string().min(3).max(15).required(),
});

const signUpSchema = Joi.object({
  email: Joi.string().email().min(3).max(100).required(),
  nickname: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(3).max(15).required(),
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 3,
    max: 100,
    unique: true,
  },
  nickname: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 3,
    max: 1024,
  },
});

userSchema.pre("save", function (next) {
  const user = this;
  const callback = function (err, hash) {
    if (_.isNil(err)) {
      user.password = hash;
      next();
    } else {
      next(err);
    }
  };
  if (user.isModified("password")) {
    bcrypt.hash(user.password, user.password.length, callback);
  } else {
    next();
  }
});

userSchema.methods.validatePassword = async function (plainPass) {
  return bcrypt.compare(plainPass, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = {
  default: User,
  validateDecodedJWT: createValidator(jwtSchema),
  validateLogin: createValidator(loginSchema),
  validateSignUp: createValidator(signUpSchema),
};
