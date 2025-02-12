const userRouter = require("express").Router();
const { registerUser, loginUser, getAllUsers } = require("../Controllers/user-controllers");
const { authoriseAdmin } = require("../middleware/adminAuth");

userRouter.route("/").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/").get(authoriseAdmin, getAllUsers);

module.exports = userRouter;
