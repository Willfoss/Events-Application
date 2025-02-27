const bcrypt = require("bcrypt");
const { postNewUser, signInUser, fetchAllUsers, updateUserRole, fetchEventsForUser } = require("../Models/user-models");

function registerUser(request, response, next) {
  const { email, name, password, role } = request.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  postNewUser(email, name, hashedPassword, role)
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
  const { search } = request.query;
  fetchAllUsers(search)
    .then((users) => {
      response.send({ users });
    })
    .catch((error) => {
      next(error);
    });
}

function patchUserRole(request, response, next) {
  const { user_id, role } = request.body;
  updateUserRole(user_id, role)
    .then((user) => {
      response.send({ user });
    })
    .catch((error) => {
      next(error);
    });
}

function getEventsForUser(request, response, next) {
  const { user_id } = request.params;
  const logged_in_user_id = request.user;
  fetchEventsForUser(user_id, logged_in_user_id)
    .then((events) => {
      response.send({ events });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { registerUser, loginUser, getAllUsers, patchUserRole, getEventsForUser };
