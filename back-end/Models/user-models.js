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

module.exports = { postNewUser, signInUser };
