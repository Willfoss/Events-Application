const jwt = require("jsonwebtoken");

function generateToken(user) {
  const payload = {
    userId: user.user_id,
    role: user.role,
  };
}

module.export = generateToken;
