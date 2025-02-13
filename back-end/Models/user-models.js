const db = require("../db/connection");
const bcrypt = require("bcrypt");
const { generateToken } = require("../config/generate-token");

function postNewUser(email, name, password) {
  if (!email || !password || !name) {
    return Promise.reject({ status: 400, message: "bad request: email, name and password are all required" });
  }

  const queryString = `INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING *;`;
  return db.query(queryString, [email, name, password]).then(({ rows }) => {
    return rows[0];
  });
}

function signInUser(email, password) {
  if (!email || !password) {
    return Promise.reject({ status: 400, message: "both email and password are required" });
  }
  const queryString = `SELECT * FROM users WHERE email = $1`;
  return db.query(queryString, [email]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "that email address does not exist in the system" });
    }
    return Promise.all([rows[0], bcrypt.compare(password, rows[0].password)]).then(([user, isPasswordAMatch]) => {
      if (isPasswordAMatch) {
        const token = generateToken(user);
        return { ...user, token };
      } else {
        return Promise.reject({ status: 401, message: "invalid password" });
      }
    });
  });
}

function fetchAllUsers() {
  const queryString = `SELECT * FROM users;`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
}

function updateUserRole(user_id, updatedRole) {
  const allowedPatch = ["user", "staff", "admin"];
  const patchRequest = [];

  if (!user_id || !updatedRole) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  if (allowedPatch.includes(updatedRole.toLowerCase())) {
    patchRequest.push(updatedRole);
    patchRequest.push(user_id);
  } else {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  const queryString = `UPDATE users
  SET role = $1
  WHERE user_id = $2
  RETURNING*;`;

  return db.query(queryString, patchRequest).then(({ rows }) => {
    return rows[0];
  });
}

module.exports = { postNewUser, signInUser, fetchAllUsers, updateUserRole };
