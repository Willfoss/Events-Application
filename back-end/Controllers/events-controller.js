const { fetchAllEvents, fetchEventByEventId, createNewEvent, updateExistingEvent, removeEvent } = require("../Models/event-models");

function getAllEvents(request, response, next) {
  const { search, date } = request.query;
  fetchAllEvents(search, date)
    .then((events) => {
      response.send({ events });
    })
    .catch((error) => {
      next(error);
    });
}

function getEventByEventId(request, response, next) {
  const { event_id } = request.params;
  fetchEventByEventId(event_id)
    .then((event) => {
      response.send({ event });
    })
    .catch((error) => {
      next(error);
    });
}

function postNewEvent(request, response, next) {
  const { event_title, event_description, host, image, location, start_date, end_date, start_time, end_time, link } = request.body;
  createNewEvent(event_title, event_description, host, image, location, start_date, end_date, start_time, end_time, link)
    .then((event) => {
      response.status(201).send({ event });
    })
    .catch((error) => {
      next(error);
    });
}

function patchExistingEvent(request, response, next) {
  const { event_title, event_description, host, image, location, start_date, end_date, start_time, end_time, link } = request.body;
  const { event_id } = request.params;
  updateExistingEvent(event_id, event_title, event_description, host, image, location, start_date, end_date, start_time, end_time, link)
    .then((event) => {
      response.send({ event });
    })
    .catch((error) => {
      next(error);
    });
}

function deleteEvent(request, response, next) {
  const { event_id } = request.params;
  removeEvent(event_id)
    .then(() => {
      response.sendStatus(204);
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { getAllEvents, getEventByEventId, postNewEvent, patchExistingEvent, deleteEvent };
