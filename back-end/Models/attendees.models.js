const db = require("../db/connection");
const { fetchEventByEventId } = require("./event-models");

function fetchAttendeesByEventId(event_id) {
  const queryString = `SELECT events.event_id,  attendees.attendee_id, users.name, users.email FROM events
    LEFT JOIN attendees ON attendees.event_id=events.event_id
    LEFT JOIN users ON users.user_id=attendees.user_id
    WHERE events.event_id = $1
    GROUP BY users.name, attendees.attendee_id, users.user_id, events.event_id`;

  return Promise.all([fetchEventByEventId(event_id), db.query(queryString, [event_id])]).then(([doesEventExist, query]) => {
    if (query.rows.length === 1 && query.rows[0].email === null) {
      return [];
    } else {
      return query.rows;
    }
  });
}

function registerForEvent(event_id, user_id) {
  const queryString = `INSERT INTO attendees (event_id, user_id)
    VALUES ($1, $2)
    RETURNING *`;

  return db.query(queryString, [event_id, user_id]).then(({ rows }) => {
    console.log(rows);
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "event not found" });
    }
    return rows[0];
  });
}

function removeEventAttendee(logged_in_user_id, event_id, user_id) {
  const findAttendeeQueryString = `SELECT * FROM attendees WHERE event_id = $1 AND user_id = $2`;
  if (!logged_in_user_id) {
    return Promise.reject({ status: 400, message: "bad request" });
  }
  return db
    .query(findAttendeeQueryString, [event_id, user_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "attendee not found" });
      }
      return rows[0];
    })
    .then((attendee) => {
      console.log(attendee);
      if (logged_in_user_id !== attendee.user_id) {
        return Promise.reject({ status: 403, message: "unauthorised" });
      } else {
        const deleteQueryString = `DELETE FROM attendees WHERE event_id = $1 AND user_id = $2`;
        return db.query(deleteQueryString, [event_id, user_id]);
      }
    })
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = { fetchAttendeesByEventId, registerForEvent, removeEventAttendee };
