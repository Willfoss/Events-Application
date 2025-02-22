const { patch } = require("../app");
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

function updateExistingEvent(event_id, event_title, event_description, host, image, location, start_date, end_date, start_time, end_time, link) {
  let queryString = `UPDATE events SET`;

  const patchArray = [event_id];

  if (event_title) {
    queryString += ` event_title = $2`;
    patchArray.push(event_title);
  }
  if (event_description) {
    if (patchArray.length > 1) queryString += `,`;
    patchArray.push(event_description);
    queryString += ` event_description = $${patchArray.length}`;
  }
  if (host) {
    if (patchArray.length > 1) queryString += `,`;
    patchArray.push(host);
    queryString += ` host = $${patchArray.length}`;
  }
  if (image) {
    if (patchArray.length > 1) queryString += `,`;
    patchArray.push(image);
    queryString += ` image = $${patchArray.length}`;
  }
  if (location) {
    if (patchArray.length > 1) queryString += `,`;
    patchArray.push(location);
    queryString += ` location = $${patchArray.length}`;
  }
  if (start_date) {
    if (patchArray.length > 1) queryString += `,`;
    patchArray.push(start_date);
    queryString += ` start_date = $${patchArray.length}`;
  }
  if (end_date) {
    if (patchArray.length > 1) queryString += `,`;
    patchArray.push(end_date);
    queryString += ` end_date = $${patchArray.length}`;
  }
  if (start_time) {
    if (patchArray.length > 1) queryString += `,`;
    patchArray.push(start_time);
    queryString += ` start_time = $${patchArray.length}`;
  }
  if (end_time) {
    if (patchArray.length > 1) queryString += `,`;
    patchArray.push(end_time);
    queryString += ` end_time = $${patchArray.length}`;
  }
  if (link) {
    if (patchArray.length > 1) queryString += `,`;
    patchArray.push(link);
    queryString += ` link = $${patchArray.length}`;
  }

  queryString += ` WHERE event_id = $1 RETURNING *;`;

  return db.query(queryString, patchArray).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "event not found" });
    }
    return rows[0];
  });
}

function removeEvent(event_id) {
  const queryString = `DELETE FROM events WHERE event_id = $1`;
  return db.query(queryString, [event_id]).then(({ rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, message: "event not found" });
    }
    return;
  });
}

module.exports = { fetchAllEvents, fetchEventByEventId, createNewEvent, updateExistingEvent, removeEvent };
