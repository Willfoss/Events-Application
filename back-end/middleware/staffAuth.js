const jwt = require("jsonwebtoken");

function authoriseStaff(request, response, next) {
  if (request.headers.authorization && request.headers.authorization.startsWith("Bearer ")) {
    token = request.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role === "staff") {
      next();
    } else {
      response.status(403).send({ message: "unauthorised" });
    }
  }

  if (!token) {
    response.status(401).send({ message: "user not authenticated" });
  }
}

module.exports = authoriseStaff;
