import bcrypt from "bcrypt";

module.exports = [
  {
    email: "willfossard@outlook.com",
    name: "Will Fossard",
    password: bcrypt.hashSync("password123", 10),
    is_staff: true,
    is_admin: true,
  },
  {
    email: "usertestemail1@email.com",
    name: "usertest1",
    password: bcrypt.hashSync("password123", 10),
    is_staff: false,
    is_admin: false,
  },
  {
    email: "usertestemail2@email.com",
    name: "usertest2",
    password: bcrypt.hashSync("password123", 10),
    is_staff: false,
    is_admin: false,
  },
  {
    email: "usertestemail3@email.com",
    name: "usertest3",
    password: bcrypt.hashSync("password123", 10),
    is_staff: false,
    is_admin: false,
  },
  {
    email: "usertestemail4@email.com",
    name: "usertest4",
    password: bcrypt.hashSync("password123", 10),
    is_staff: true,
    is_admin: false,
  },
  {
    email: "usertestemail5@email.com",
    name: "usertest5",
    password: bcrypt.hashSync("password123", 10),
    is_staff: true,
    is_admin: false,
  },
];
