const format = require("pg-format");
const db = require("../connection");

const seed = ({ eventData, userData, attendeeData }) => {
  return db
    .query(`DROP TABLE IF EXISTS attendees`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS events`);
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users");
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
        email VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        is_staff BOOLEAN NOT NULL,
        is_admin BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE events (
      event_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      description VARCHAR NOT NULL,
      owner VARCHAR NOT NULL,
      location VARCHAR NOT NULL,
      start_date VARCHAR NOT NULL,
      end_date VARCHAR NOT NULL,
      start_time VARCHAR NOT NULL,
      end_time VARCHAR NOT NULL,
      link VARCHAR,
      created_at TIMESTAMP DEFAULT NOW()
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE attendees (
      attendee_id SERIAL PRIMARY KEY,
      event_id INT REFERENCES events(event_id) ON DELETE CASCADE NOT NULL,
      attendee_email VARCHAR REFERENCES users(email) ON DELETE CASCADE NOT NULL UNIQUE
      );`);
    });
};

module.exports = seed;
