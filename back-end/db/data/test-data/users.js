const bcrypt = require("bcrypt");

usersData = {
  users: [
    {
      email: "willfossard@outlook.com",
      name: "Will Fossard",
      password: bcrypt.hashSync("password123", 10),
      role: "admin",
    },
    {
      email: "usertestemail1@email.com",
      name: "usertest1",
      password: bcrypt.hashSync("password1234", 10),
      role: "user",
    },
    {
      email: "usertestemail2@email.com",
      name: "usertest2",
      password: bcrypt.hashSync("password12345", 10),
      role: "user",
    },
    {
      email: "usertestemail3@email.com",
      name: "usertest3",
      password: bcrypt.hashSync("password123456", 10),
      role: "user",
    },
    {
      email: "usertestemail4@email.com",
      name: "usertest4",
      password: bcrypt.hashSync("password1234567", 10),
      role: "staff",
    },
    {
      email: "usertestemail5@email.com",
      name: "usertest5",
      password: bcrypt.hashSync("password12345678", 10),
      role: "staff",
    },
  ],
};

module.exports = { usersData };
