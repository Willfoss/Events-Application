const format = require("pg-format");
const db = require("../connection");

const seed = ({ eventsData, usersData, attendeesData }) => {
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
        user_id SERIAL PRIMARY KEY,
        email VARCHAR UNIQUE,
        name VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        role VARCHAR DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE events (
      event_id SERIAL PRIMARY KEY,
      event_title VARCHAR NOT NULL,
      event_description VARCHAR NOT NULL,
      image VARCHAR DEFAULT 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fxim.edu.in%2Frlle-project-reports-published-in-jdms-ijitr%2F&psig=AOvVaw1DQmV_H3qzoYk92vNhtbXG&ust=1739368629904000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOCFiJzju4sDFQAAAAAdAAAAABAE',
      host VARCHAR NOT NULL,
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
      user_id INT REFERENCES users(user_id) ON DELETE CASCADE NOT NULL
      );`);
    })
    .then(() => {
      const usersQueryString = "INSERT INTO users (email, name, password, role) VALUES %L RETURNING *;";
      const usersFormattedQuery = usersData.usersData.users.map(({ email, name, password, role }) => {
        return [email, name, password, role];
      });
      return db.query(format(usersQueryString, usersFormattedQuery));
    })
    .then(() => {
      const eventsQueryString =
        "INSERT INTO events (event_title, event_description, image, host, location, start_date, end_date, start_time, end_time, link) VALUES %L RETURNING *;";
      const eventsFormattedQuery = eventsData.map(
        ({ event_title, event_description, image, host, location, start_date, end_date, start_time, end_time, link }) => {
          return [event_title, event_description, image, host, location, start_date, end_date, start_time, end_time, link];
        }
      );
      return db.query(format(eventsQueryString, eventsFormattedQuery));
    })
    .then(() => {
      const attendeesQueryString = "INSERT INTO attendees (event_id, user_id) VALUES %L RETURNING *;";
      const attendeeFormattedQuery = attendeesData.map(({ event_id, user_id }) => {
        return [event_id, user_id];
      });
      return db.query(format(attendeesQueryString, attendeeFormattedQuery));
    });
};

module.exports = seed;
