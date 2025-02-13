const db = require("../db/connection");

function fetchAllEvents() {
  const queryString = `SELECT * FROM events`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
}

module.exports = { fetchAllEvents };
