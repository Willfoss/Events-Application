const apiRouter = require("express").Router();
const eventsRouter = require("./events-router");
const userRouter = require("./user-router");
const attendeesRouter = require("./attendees.router");

apiRouter.use("/users", userRouter);
apiRouter.use("/events", eventsRouter);
apiRouter.use("/attendees", attendeesRouter);

module.exports = apiRouter;
