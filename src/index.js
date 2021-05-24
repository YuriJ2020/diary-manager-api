const express = require("express");
const createDebug = require("debug");
const config = require("config");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const connect = require("./database");

// Config values.
const serverPort = config.get("server.port");
const databaseURI = config.get("database.uri");

const debug = createDebug("app:server");
const callback = () => debug(`Serving at port ${serverPort}...`);
const startServer = () => app.listen(serverPort, callback);
const handleError = (err) => debug("Unexpected error;", err);

const app = express();

// Use Express middleware.
app.use([
  cors(),
  express.json(),
  express.urlencoded(),
  helmet(),
  morgan("combined"),
  // routes,
]);

connect(databaseURI).then(startServer).catch(handleError);
