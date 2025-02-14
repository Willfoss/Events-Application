const db = require("../db/connection");

function fetchAttendeesByEventId(event_id) {
  const queryString = `SELECT events.event_id, attendees.email, attendees.attendee_id, users.name FROM events
    LEFT JOIN attendees ON attendees.event_id=events.event_id
    LEFT JOIN users ON users.email=attendees.email
    WHERE events.event_id = $1
    GROUP BY users.name, attendees.attendee_id, attendees.email, events.event_id`;

  return db.query(queryString, [event_id]).then(({ rows }) => {
    return rows;
  });
}

module.exports = { fetchAttendeesByEventId };
