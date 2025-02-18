const jwt = require("jsonwebtoken");

function authoriseUser(request, response, next) {
  let token;

  if (request.headers.authorization && request.headers.authorization.startsWith("Bearer ")) {
    token = request.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "user" || decoded.role === "staff" || decoded.role === "admin") {
      request.user = decoded.user_id;
      next();
    } else {
      response.status(403).send({ message: "unauthorised" });
    }
  }

  if (!token) {
    response.status(401).send({ message: "user not authenticated" });
  }
}

module.exports = { authoriseUser };
