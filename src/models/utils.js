const _ = require("lodash");

// HOF
const createValidator = (schema) => (payload) =>
  _.invoke(schema, "validate", payload);

module.exports = createValidator;

// schema.validate(payload);
// _.invoke(schema, "validate", payload);
