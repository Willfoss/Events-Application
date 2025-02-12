const bcrypt = require("bcrypt");
const { postNewUser, signInUser, fetchAllUsers } = require("../Models/user-models");

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

function loginUser(request, response, next) {
  const { email, password } = request.body;
  signInUser(email, password)
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch((error) => {
      next(error);
    });
}

function getAllUsers(request, response, next) {
  fetchAllUsers()
    .then((users) => {
      response.send({ users });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { registerUser, loginUser, getAllUsers };
