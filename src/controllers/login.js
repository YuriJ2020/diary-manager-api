const _ = require("lodash");
const createDebug = require("debug");
const { createValidator, jwtSignUser } = require("./utils");
const { default: User, validateLogin } = require("../models/User");

const debug = createDebug("app:controller:login");

module.exports = {
  validate: createValidator(validateLogin),

  post: async (req, res) => {
    try {
      const {
        body: { email, password },
      } = req;
      const user = await User.findOne({ email }).exec();
      if (_.isNil(user)) {
        debug("User with given email does not exist:", email);
        res.status(401).send({ error: "User Not Available" });
        return; //終わり、次に続かない
      }
      const isPassValid = await user.validatePassword(password);
      if (isPassValid) {
        const JWT = jwtSignUser(user.toJSON());
        res.set({ JWT }).send({ user });
        return;
      }
      // else
      debug("Unsuccessful login for user email:", email);
      res.status(401).send({ error: "Password Invalid" });
      return;
    } catch (err) {
      debug("Error at login POST call:", err);
      res.status(500).send({ error: err });
    }
  },
};
