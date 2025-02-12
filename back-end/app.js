const express = require("express");
const cors = require("cors");
const { serverErrorHandler } = require("./error-handling");
const apiRouter = require("./routes/api-router");

const app = express();
app.use(cors());

app.get("/", (request, response) => {
  response.send("API ONLINE");
});

app.use("/api", apiRouter);

app.all("*", (response, request) => {
  response.status(404).send({ message: "this path does not exist" });
});

app.use(serverErrorHandler);

module.exports = app;
