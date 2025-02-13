const eventsRouter = require("express").Router();
const { getAllEvents, getEventByEventId, postNewEvent } = require("../Controllers/events-controller");
const { authoriseUser } = require("../middleware/userAuth");
const { authoriseStaff } = require("../middleware/staffAuth");

eventsRouter.route("/").get(authoriseUser, getAllEvents);
eventsRouter.route("/:event_id").get(authoriseUser, getEventByEventId);
eventsRouter.route("/").post(authoriseStaff, postNewEvent);

module.exports = eventsRouter;
