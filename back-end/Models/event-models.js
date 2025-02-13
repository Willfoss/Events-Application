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
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "event not found" });
    }
    return rows[0];
  });
}

function createNewEvent(event_title, event_description, host, image, location, start_date, end_date, start_time, end_time, link) {
  if (!event_title || !event_description || !host || !image || !location || !start_date || !end_date || !start_time || !end_time) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  const eventPropertyArray = [event_title, event_description, host, image, location, start_date, end_date, start_time, end_time];

  let queryString = `INSERT INTO events (event_title, event_description, host, image, location, start_date, end_date, start_time, end_time`;

  if (link) {
    queryString += `, link) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`;
    eventPropertyArray.push(link);
  } else {
    queryString += `) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`;
  }

  return db.query(queryString, eventPropertyArray).then(({ rows }) => {
    return rows[0];
  });
}

module.exports = { fetchAllEvents, fetchEventByEventId, createNewEvent };
