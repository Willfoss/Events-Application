const express = require("express");
const cors = require("cors");
const { serverErrorHandler, customErrorHandler, databaseErrorHandler } = require("./error-handling");
const apiRouter = require("./routes/api-router");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.send("API ONLINE");
});

app.use("/api", apiRouter);

app.all("*", (response, request) => {
  response.status(404).send({ message: "this path does not exist" });
});

app.use(customErrorHandler);
app.use(databaseErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
