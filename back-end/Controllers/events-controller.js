const { fetchAllEvents } = require("../Models/event-models");

function getAllEvents(request, response, next) {
  fetchAllEvents()
    .then((events) => {
      response.send({ events });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { getAllEvents };
