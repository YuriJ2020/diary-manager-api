const createDebug = require("debug");

const { createValidator, jwtSignUser } = require("./utils");
const { default: User, validateSignUp } = require("../models/User");

const debug = createDebug("app:controller:signup");

const signUp = {
  validate: createValidator(validateSignUp),

  post: async (req, res) => {
    const { body } = req;
    try {
      const user = await new User(body).save();
      const JWT = jwtSignUser(user.toJSON());
      res.set({ JWT }).send({ user });
    } catch (err) {
      debug("Error at sign-up POST call:", err);
      res.status(400).send({ error: err });
    }
  },
};

module.exports = signUp;
