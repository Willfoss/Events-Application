const userRouter = require("express").Router();
const { registerUser, loginUser, getAllUsers, patchUserRole, getEventsForUser } = require("../Controllers/user-controllers");
const { authoriseAdmin } = require("../middleware/adminAuth");
const { authoriseUser } = require("../middleware/userAuth");

userRouter.route("/").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/").get(authoriseAdmin, getAllUsers);
userRouter.route("/").patch(authoriseAdmin, patchUserRole);
userRouter.route("/:user_id/events").get(authoriseUser, getEventsForUser);

module.exports = userRouter;
