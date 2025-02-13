const { fetchAllEvents, fetchEventByEventId } = require("../Models/event-models");

function getAllEvents(request, response, next) {
  fetchAllEvents()
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

module.exports = { getAllEvents, getEventByEventId };
