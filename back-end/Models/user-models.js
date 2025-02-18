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

function fetchEventsForUser(user_id, logged_in_user_id) {
  const getAllEventsUserQueryString = `SELECT users.user_id, users.email, users.name, events.* FROM users
  LEFT JOIN attendees ON attendees.user_id=users.user_id
  LEFT JOIN events ON events.event_id=attendees.event_id
  WHERE users.user_id = $1
  GROUP BY users.user_id, attendees.attendee_id, events.event_id
  `;

  const checkUserExists = `SELECT * FROM users WHERE user_id = $1`;

  if (isNaN(user_id)) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  if (logged_in_user_id === +user_id) {
    return Promise.all([db.query(checkUserExists, [user_id]), db.query(getAllEventsUserQueryString, [user_id])]).then(
      ([doesUserExist, usersEvents]) => {
        if (usersEvents.rows.length === 1 && usersEvents.rows[0].event_id === null) {
          return [];
        } else {
          return usersEvents.rows;
        }
      }
    );
  } else {
    return Promise.reject({ status: 403, message: "unauthorised" });
  }
}

module.exports = { postNewUser, signInUser, fetchAllUsers, updateUserRole, fetchEventsForUser };
