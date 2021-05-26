const _ = require("lodash");
const createDebug = require("debug");

const {
  default: Diary,
  validateCreation,
  validateQuery,
} = require("../models/Diary");

const {
  authenticate,
  createValidator,
  locateDiariesWithQuery,
  processDiaries,
} = require("./utils");

const debug = createDebug("app:controller:diary");

module.exports = {
  validateCreation: createValidator(validateCreation),
  validateQuery: createValidator(validateQuery),

  get: (req, res) => authenticate(req, res, debug, locateDiariesWithQuery),
  post: (req, res) =>
    authenticate(req, res, debug, (body) => new Diary(body).save()),

  put: (req, res) =>
    authenticate(req, res, debug, (body) =>
      processDiaries(body, debug, (diaries) => _.head(diaries).set(body).save())
    ),

  delete: (req, res) =>
    authenticate(req, res, debug, (body) =>
      processDiaries(body, debug, (diaries) => _.head(diaries).remove())
    ),
};
