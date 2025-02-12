const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("USERS testing", () => {
  describe("POST register new user", () => {
    test("POST 201: successfully registers a new user with the default role set to user", () => {
      return request(app)
        .post("/api/users")
        .send({ email: "testSuite@email.com", name: "testSuiteName", password: "testSuitePassword" })
        .expect(201)
        .then(({ body }) => {
          expect(body.user).toMatchObject({
            user_id: 7,
            name: "testSuiteName",
            email: "testSuite@email.com",
            password: expect.any(String),
            role: "user",
          });
        });
    });
    test("POST 201: password is stored in hashed form", () => {
      return request(app)
        .post("/api/users")
        .send({ email: "testSuite@email.com", name: "testSuiteName", password: "testSuitePassword" })
        .expect(201)
        .then(({ body }) => {
          expect(body.user.password).not.toBe("testSuitePassword");
          expect(typeof body.user.password).toBe("string");
        });
    });
    test("POST 201: ignores any additional information sent in request", () => {
      return request(app)
        .post("/api/users")
        .send({ email: "testSuite@email.com", name: "testSuiteName", password: "testSuitePassword", job: "purchasing" })
        .expect(201)
        .then(({ body }) => {
          expect(body.user).toMatchObject({
            user_id: 7,
            name: "testSuiteName",
            email: "testSuite@email.com",
            password: expect.any(String),
            role: "user",
          });
          expect(body.user.hasOwnProperty("job")).toBe(false);
        });
    });
    test("POST 400: returns a bad request message if key information is missing from request", () => {
      return request(app)
        .post("/api/users")
        .send({ name: "testSuiteName", password: "testSuitePassword" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request: email, name and password are all required");
        });
    });
    test("POST 409: informs user that email address is already registered if it already exists in db", () => {
      return request(app)
        .post("/api/users")
        .send({ email: "usertestemail4@email.com", name: "testSuiteName", password: "testSuitePassword" })
        .expect(409)
        .then(({ body }) => {
          expect(body.message).toBe("email address is already registered");
        });
    });
  });
});
