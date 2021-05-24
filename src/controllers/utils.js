const _ = require("lodash");
const { Document } = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const { validateDecodedJWT } = require("../models/User");
const Diary = require("../models/Diary");

const expireInSec = config.get("security.token.expireInSec");
const secret = config.get("security.token.secret");

exports.jwtSignUser = (user) => {
  const payload = _.pick(user, ["email", "nickname", "password"]);
  return jwt.sign(payload, secret, { expiresIn: `${expireInSec}s` });
};

exports.jwtVerifyUser = (token) => {
  const decoded = jwt.verify(token, secret);
  const { error, value } = validateDecodedJWT(decoded);
  if (_.isNil(error)) {
    return value;
  }
  throw error;
};

exports.createValidator = (validateFn) => (req, res, next) => {
  const { body } = req;
  const { error } = validateFn(body);
  const hasErr = !(_.isNil(error) || _.isEmpty(error.details));
  if (hasErr) {
    res.status(400).json({ error: error.details });
  } else {
    next();
  }
};

exports.authenticate = async (req, res, log, done) => {
  try {
    const JWT = req.get("JWT");
    // Verify the JWT token from request headers.
    const decoded = jwtVerifyUser(JWT);
    const { body, query } = req;
    // Verify the email from the JWT token is the same as the email from the request body.
    if (body.email === decoded.email || query.email === decoded.email) {
      const result = await done(body, query);
      if (result instanceof Document) {
        res.set({ JWT }).send({ diary: result });
        return;
      }
      if (_.isArray(result)) {
        res.set({ JWT }).send({ diaries: result });
        return;
      }
      res.status(401).send({ error: result });
      return;
    }
    const error = {
      message: "The body email is different from the token email.",
      bodyEmail: body.email,
      tokenEmail: decoded.email,
    };
    log("Email validation failed:", error);
    res.status(401).send({ error });
  } catch (err) {
    log("Error at diary POST call:", err);
    res.status(400).send({ error: err });
  }
};

exports.locateDiaries = async (body) => {
  const { datetime, email } = body;
  const date = moment(datetime).utc().toDate();
  const filter = {
    email,
    ...(!_.isNil(datetime) && { datetime: date }),
  };
  return Diary.find(filter).sort({ datetime: -1 }).exec();
};

exports.locateDiariesWithQuery = async (_body, query) => {
  const { datetime, email } = query;
  const date = _.isNil(datetime) ? undefined : moment(datetime).utc().toDate();
  const filter = {
    email,
    ...(!_.isNil(datetime) && { datetime: date }),
  };
  return Diary.find(filter).sort({ datetime: -1 }).exec();
};

exports.processDiaries = async (body, log, process) => {
  const { datetime, email } = body;
  const diaries = await locateDiaries(body);
  if (_.isEmpty(diaries)) {
    const error = {
      message: "Diary with given datetime and email does not exist.",
      datetime,
      email,
    };
    log("Failed to locate a diary:", error);
    return error;
  }
  return process(diaries);
};
