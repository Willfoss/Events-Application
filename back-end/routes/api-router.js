const apiRouter = require("express").Router();
const eventsRouter = require("./events-router");
const userRouter = require("./user-router");

apiRouter.use("/users", userRouter);
apiRouter.use("/events", eventsRouter);

module.exports = apiRouter;
