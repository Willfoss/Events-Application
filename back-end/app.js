const express = require("express");

const { serverErrorHandler } = require("./error-handling");

const app = express();

app.use(serverErrorHandler);

module.exports = app;
