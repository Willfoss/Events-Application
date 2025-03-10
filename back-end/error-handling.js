function customErrorHandler(error, request, response, next) {
  if (error.status === 400 || error.status === 401 || error.status === 403 || error.status === 409 || error.status === 404) {
    response.status(error.status).send({ message: error.message });
  }
  next(error);
}

function databaseErrorHandler(error, request, response, next) {
  if (error.code === "23505") {
    response.status(409).send({ message: "email address is already registered" });
  }
  if (error.code === "22P02") {
    response.status(400).send({ message: "bad request" });
  }
  if (error.code === "23503") {
    response.status(404).send({ message: "event not found" });
  }
  next(error);
}

function serverErrorHandler(error, request, response, next) {
  response.status(500).send({ message: "internal server error" });
}

module.exports = { serverErrorHandler, customErrorHandler, databaseErrorHandler };
