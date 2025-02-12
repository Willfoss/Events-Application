const userRouter = require("express").Router();
const { registerUser } = require("../Controllers/user-controllers");

userRouter.route("/").post(registerUser);

module.exports = userRouter;
