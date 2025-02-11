const { serverErrorHandler } = require("../error-handling");

const app = express();

app.user(serverErrorHandler);

module.exports = app;
