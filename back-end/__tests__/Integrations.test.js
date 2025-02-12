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
  describe("POST login and authenticate registered user", () => {
    test("POST 201: returns the user object that has just signed in if username and password are correct. includes auth token", () => {
      return request(app)
        .post("/api/users/login")
        .send({ email: "willfossard@outlook.com", password: "password123" })
        .expect(201)
        .then(({ body }) => {
          expect(body.user).toMatchObject({
            user_id: 1,
            name: "Will Fossard",
            email: "willfossard@outlook.com",
            password: expect.any(String),
            role: "admin",
            token: expect.any(String),
          });
        });
    });
    test("POST 201: ignores any additional information sent in request", () => {
      return request(app)
        .post("/api/users/login")
        .send({ email: "usertestemail1@email.com", password: "password1234", age: 44 })
        .expect(201)
        .then(({ body }) => {
          expect(body.user).toMatchObject({
            user_id: 2,
            name: "usertest1",
            email: "usertestemail1@email.com",
            password: expect.any(String),
            role: "user",
            token: expect.any(String),
          });
          expect(body.user.hasOwnProperty("age")).toBe(false);
        });
    });
    test("POST 400: bad request response returned if missing required information", () => {
      return request(app)
        .post("/api/users/login")
        .send({ email: "willfossard@outlook.com" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("both email and password are required");
        });
    });
    test("POST 401: returns a message showing invalid authorisation credentials", () => {
      return request(app)
        .post("/api/users/login")
        .send({ email: "willfossard@outlook.com", password: "wrongpassword" })
        .expect(401)
        .then(({ body }) => {
          expect(body.message).toBe("invalid password");
        });
    });
    test("POST 404: returns a message indicating the email does not exist", () => {
      return request(app)
        .post("/api/users/login")
        .send({ email: "fakeemail@email.com", password: "fakepassword" })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("that email address does not exist in the system");
        });
    });
  });
  describe("GET a list of all users (admin only)", () => {
    let adminUser;
    let userUser;
    let staffUser;

    beforeEach(() => {
      return request(app)
        .post("/api/users/login")
        .send({ email: "willfossard@outlook.com", password: "password123" })
        .then(({ body }) => {
          adminUser = body.user;
        });
    });

    beforeEach(() => {
      return request(app)
        .post("/api/users/login")
        .send({ email: "usertestemail1@email.com", password: "password1234" })
        .then(({ body }) => {
          userUser = body.user;
        });
    });

    beforeEach(() => {
      return request(app)
        .post("/api/users/login")
        .send({ email: "usertestemail4@email.com", password: "password1234567" })
        .then(({ body }) => {
          staffUser = body.user;
        });
    });

    test("GET 200: returns a list of all users in the db", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .set({ authorization: `Bearer ${adminUser.token}` })
        .then(({ body }) => {
          expect(body.users.length).toBe(6);
          body.users.forEach((user) => {
            expect(user).toMatchObject({
              user_id: expect.any(Number),
              email: expect.any(String),
              name: expect.any(String),
              role: expect.any(String),
            });
          });
        });
    });

    test("GET 401: returns a not authenticated message if somebody not listed on the db tries to access the data", () => {
      return request(app)
        .get("/api/users")
        .expect(401)
        .then(({ body }) => {
          expect(body.message).toBe("user not authenticated");
        });
    });
    test("GET 403: returns a not authorised message if a staff member tries to access the data ", () => {
      return request(app)
        .get("/api/users")
        .set({ authorization: `Bearer ${staffUser.token}` })
        .expect(403)
        .then(({ body }) => {
          expect(body.message).toBe("unauthorised");
        });
    });
    test("GET 403: returns a not authorised message if a user tries to access the data ", () => {
      return request(app)
        .get("/api/users")
        .set({ authorization: `Bearer ${userUser.token}` })
        .expect(403)
        .then(({ body }) => {
          expect(body.message).toBe("unauthorised");
        });
    });
  });
});
