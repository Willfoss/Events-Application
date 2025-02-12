function customErrorHandler(error, request, response, next) {
  if (error.status === 400) {
    response.status(error.status).send({ message: error.message });
  }
  next(error);
}

function databaseErrorHandler(error, request, response, next) {
  if (error.code === "23505") {
    response.status(409).send({ message: "email address is already registered" });
  }
  next(error);
}

function serverErrorHandler(error, request, response, next) {
  console.log(error, "ERROR");
  response.status(500).send({ message: "internal server error" });
}

module.exports = { serverErrorHandler, customErrorHandler, databaseErrorHandler };
