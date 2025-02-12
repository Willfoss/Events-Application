const bcrypt = require("bcrypt");
const { postNewUser } = require("../Models/user-models");

function registerUser(request, response, next) {
  const { email, name, password } = request.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  postNewUser(email, name, hashedPassword)
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { registerUser };
