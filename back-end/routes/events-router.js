const eventsRouter = require("express").Router();
const { getAllEvents } = require("../Controllers/events-controller");
const { authoriseUser } = require("../middleware/userAuth");

eventsRouter.route("/").get(authoriseUser, getAllEvents);

module.exports = eventsRouter;
