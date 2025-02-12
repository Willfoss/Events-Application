const db = require("../db/connection");

function postNewUser(email, name, password) {
  if (!email || !password || !name) {
    return Promise.reject({ status: 400, message: "bad request: email, name and password are all required" });
  }

  const queryString = `INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING *;`;
  return db.query(queryString, [email, name, password]).then(({ rows }) => {
    return rows[0];
  });
}

module.exports = { postNewUser };
