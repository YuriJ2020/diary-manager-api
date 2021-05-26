const { defaultFormat } = require("moment");
const JoiDate = require("@joi/date");
const JoiOriginal = require("joi");
const mongoose = require("mongoose");

const createValidator = require("./utils");

const Joi = JoiOriginal.extend(JoiDate);

const creationSchema = Joi.object({
  email: Joi.string().email().min(3).max(100).required(),
  datetime: Joi.date().format(defaultFormat).required(),
  message: Joi.string().min(1).max(3000).required(),
});

const querySchema = Joi.object({
  email: Joi.string().email().min(3).max(100).required(),
  datetime: Joi.date().format(defaultFormat),
});

const diarySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 3,
    max: 100,
  },
  datetime: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
    required: true,
    min: 1,
    max: 3000,
  },
});

const Diary = mongoose.model("Diary", diarySchema);

module.exports = {
  default: Diary,
  validateCreation: createValidator(creationSchema),
  validateQuery: createValidator(querySchema),
};
