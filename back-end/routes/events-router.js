const eventsRouter = require("express").Router();
const { getAllEvents, getEventByEventId, postNewEvent, patchExistingEvent } = require("../Controllers/events-controller");
const { authoriseUser } = require("../middleware/userAuth");
const { authoriseStaff } = require("../middleware/staffAuth");

eventsRouter.route("/").get(authoriseUser, getAllEvents);
eventsRouter.route("/:event_id").get(authoriseUser, getEventByEventId);
eventsRouter.route("/").post(authoriseStaff, postNewEvent);
eventsRouter.route("/:event_id").patch(authoriseStaff, patchExistingEvent);

module.exports = eventsRouter;
