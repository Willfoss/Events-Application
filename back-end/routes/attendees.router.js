const { authoriseStaff } = require("../middleware/staffAuth");
const { getAttendeesByEventId } = require("../Controllers/attendees-controllers");

const attendeesRouter = require("express").Router();

attendeesRouter.route("/:event_id").get(authoriseStaff, getAttendeesByEventId);

module.exports = attendeesRouter;
