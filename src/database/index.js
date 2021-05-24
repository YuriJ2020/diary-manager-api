const createDebug = require("debug");
const mongoose = require("mongoose");

const debug = createDebug("app:database");

const connect = async (uri) => {
  const db = mongoose.connection;
  db.on("error", (args) => debug(`Failed to connect to database; ${args}`));
  db.once("open", () => debug("Database connection opened;"));
  db.openUri(uri, {
    serverSelectionTimeoutMS: 3000,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return db;
};

module.exports = connect;
