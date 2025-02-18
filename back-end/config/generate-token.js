const jwt = require("jsonwebtoken");

function generateToken(user) {
  const payload = {
    user_id: user.user_id,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
}

module.exports = { generateToken };
