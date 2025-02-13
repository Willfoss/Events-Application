const userRouter = require("express").Router();
const { registerUser, loginUser, getAllUsers, patchUserRole } = require("../Controllers/user-controllers");
const { authoriseAdmin } = require("../middleware/adminAuth");

userRouter.route("/").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/").get(authoriseAdmin, getAllUsers);
userRouter.route("/").patch(authoriseAdmin, patchUserRole);

module.exports = userRouter;
