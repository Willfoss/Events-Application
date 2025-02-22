import axios from "axios";

const eventsphereApi = axios.create({
  baseURL: `${process.env.VITE_API_URL}/api`,
});

export function registerNewUser(name, email, password) {
  return eventsphereApi.post("/users", { name, email, password }).then(({ data }) => {
    return data;
  });
}

export function logInUser(email, password) {
  return eventsphereApi.post("/users/login", { email, password }).then(({ data }) => {
    return data;
  });
}

export function getAllEvents(authorisation) {
  return eventsphereApi.get("/events", authorisation).then(({ data }) => {
    return data;
  });
}

export function getSingleEvent(event_id, authorisation) {
  return eventsphereApi.get(`/events/${event_id}`, authorisation).then(({ data }) => {
    return data;
  });
}

export function registerForEvent(event_id, user_id, authorisation) {
  return eventsphereApi.post("/attendees", { event_id, user_id }, authorisation).then(({ data }) => {
    return data;
  });
}

export function deleteEventAttendee(event_id, user_id, authorisation) {
  return eventsphereApi.delete(`/attendees/${event_id}/${user_id}`, authorisation);
}

export function getAttendeesForEvent(event_id, authorisation) {
  return eventsphereApi.get(`/attendees/${event_id}`, authorisation).then(({ data }) => {
    return data.attendees;
  });
}

export function getAllEventsForUser(user_id, authorisation) {
  return eventsphereApi.get(`/users/${user_id}/events`, authorisation).then(({ data }) => {
    return data.events;
  });
}

export function patchEventDetails(
  event_id,
  event_title,
  event_description,
  host,
  image,
  location,
  start_date,
  end_date,
  start_time,
  end_time,
  link,
  authorisation
) {
  start_date = start_date.split("-").reverse().join("/");
  end_date = end_date.split("-").reverse().join("/");
  return eventsphereApi.patch(
    `/events/${event_id}`,
    { event_title, event_description, host, image, location, start_date, end_date, start_time, end_time, link },
    authorisation
  );
}

export function deleteEvent(event_id, authorisation) {
  return eventsphereApi(`/events/${event_id}`, authorisation);
}
