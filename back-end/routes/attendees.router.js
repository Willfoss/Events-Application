const { authoriseStaff } = require("../middleware/staffAuth");
const { getAttendeesByEventId, postNewAttendee } = require("../Controllers/attendees-controllers");
const { authoriseUser } = require("../middleware/userAuth");

const attendeesRouter = require("express").Router();

attendeesRouter.route("/:event_id").get(authoriseStaff, getAttendeesByEventId);
attendeesRouter.route("/").post(authoriseUser, postNewAttendee);

module.exports = attendeesRouter;
