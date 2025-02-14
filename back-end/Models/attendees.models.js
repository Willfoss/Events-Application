const db = require("../db/connection");
const { fetchEventByEventId } = require("./event-models");

function fetchAttendeesByEventId(event_id) {
  const queryString = `SELECT events.event_id, attendees.email, attendees.attendee_id, users.name FROM events
    LEFT JOIN attendees ON attendees.event_id=events.event_id
    LEFT JOIN users ON users.email=attendees.email
    WHERE events.event_id = $1
    GROUP BY users.name, attendees.attendee_id, attendees.email, events.event_id`;

  return Promise.all([fetchEventByEventId(event_id), db.query(queryString, [event_id])]).then(([doesEventExist, query]) => {
    if (query.rows.length === 1 && query.rows[0].email === null) {
      return [];
    } else {
      return query.rows;
    }
  });
}

function registerForEvent(event_id, email) {
  const queryString = `INSERT INTO attendees (event_id, email)
    VALUES ($1, $2)
    RETURNING *`;

  return db.query(queryString, [event_id, email]).then(({ rows }) => {
    console.log(rows);
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "event not found" });
    }
    return rows[0];
  });
}

module.exports = { fetchAttendeesByEventId, registerForEvent };
