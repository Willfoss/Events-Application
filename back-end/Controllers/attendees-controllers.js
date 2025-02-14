const { fetchAttendeesByEventId } = require("../Models/attendees.models");

function getAttendeesByEventId(request, response, next) {
  const { event_id } = request.params;
  fetchAttendeesByEventId(event_id)
    .then((attendees) => {
      response.send({ attendees });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { getAttendeesByEventId };
