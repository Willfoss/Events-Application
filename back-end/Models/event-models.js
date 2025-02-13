const db = require("../db/connection");

function fetchAllEvents() {
  const queryString = `SELECT * FROM events`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
}

function fetchEventByEventId(event_id) {
  const queryString = `SELECT events.* , COUNT(attendees.attendee_id)::INT as number_of_attendees FROM events
  LEFT JOIN attendees on attendees.event_id=events.event_id
  WHERE events.event_id = $1
  GROUP BY events.event_id;`;

  return db.query(queryString, [event_id]).then(({ rows }) => {
    return rows[0];
  });
}

module.exports = { fetchAllEvents, fetchEventByEventId };
