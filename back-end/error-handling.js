const serverErrorHandler = (error, request, response, next) => {
  console.log(error);
  response.status(500).send({ message: "internal server error" });
};

module.exports = { serverErrorHandler };
