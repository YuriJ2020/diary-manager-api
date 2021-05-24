const express = require("express");
const createDebug = require("debug");
const config = require("config");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

// Config values.
const serverPort = config.get("server.port");
const databaseURI = config.get("database.uri");

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

const debug = createDebug("app:server");
const callback = () => debug(`Serving at port ${serverPort}...`);
const startServer = () => app.listen(serverPort, callback);

startServer();
