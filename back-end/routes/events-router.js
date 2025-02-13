const eventsRouter = require("express").Router();
const { getAllEvents, getEventByEventId } = require("../Controllers/events-controller");
const { authoriseUser } = require("../middleware/userAuth");

eventsRouter.route("/").get(authoriseUser, getAllEvents);
eventsRouter.route("/:event_id").get(authoriseUser, getEventByEventId);

module.exports = eventsRouter;
