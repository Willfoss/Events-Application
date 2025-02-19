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
