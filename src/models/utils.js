const _ = require("lodash");

const createValidator = (schema) => (payload) =>
  _.invoke(schema, "validate", payload);

module.exports = createValidator;
