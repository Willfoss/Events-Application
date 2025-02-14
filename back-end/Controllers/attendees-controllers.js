const { fetchAttendeesByEventId, registerForEvent } = require("../Models/attendees.models");

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

function postNewAttendee(request, response, next) {
  const { event_id, email } = request.body;
  registerForEvent(event_id, email)
    .then((attendee) => {
      response.status(201).send({ attendee });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { getAttendeesByEventId, postNewAttendee };
