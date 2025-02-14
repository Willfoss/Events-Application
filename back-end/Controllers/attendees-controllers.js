const { fetchAttendeesByEventId, registerForEvent, removeEventAttendee } = require("../Models/attendees.models");

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
  const { event_id, user_id } = request.body;
  registerForEvent(event_id, user_id)
    .then((attendee) => {
      response.status(201).send({ attendee });
    })
    .catch((error) => {
      next(error);
    });
}

function deleteEventAttendee(request, response, next) {
  const { logged_in_user_id } = request.body;
  const { event_id, user_id } = request.params;
  removeEventAttendee(logged_in_user_id, event_id, user_id)
    .then((attendee) => {
      response.sendStatus(204);
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { getAttendeesByEventId, postNewAttendee, deleteEventAttendee };
