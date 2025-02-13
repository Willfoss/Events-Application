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

    test("GET 200: returns a list of all users in the db if an admin tries to access to data", () => {
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
  describe("PATCH role of users/staff/admin (admin only)", () => {
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

    test("PATCH 200: returns the updated user object when changing user role to staff", () => {
      return request(app)
        .patch("/api/users")
        .set({ authorization: `Bearer ${adminUser.token}` })
        .send({ user_id: 2, role: "staff" })
        .expect(200)
        .then(({ body }) => {
          expect(body.user).toMatchObject({
            user_id: 2,
            email: "usertestemail1@email.com",
            name: "usertest1",
            password: expect.any(String),
            role: "staff",
          });
        });
    });

    test("PATCH 200: ignores any additional information sent in the request", () => {
      return request(app)
        .patch("/api/users")
        .set({ authorization: `Bearer ${adminUser.token}` })
        .send({ user_id: 2, role: "staff", age: 40 })
        .expect(200)
        .then(({ body }) => {
          expect(body.user).toMatchObject({
            user_id: 2,
            email: "usertestemail1@email.com",
            name: "usertest1",
            password: expect.any(String),
            role: "staff",
          });
          expect(body.user.hasOwnProperty("age")).toBe(false);
        });
    });
    test("patch 400: returns bad request if required information is missing from the request", () => {
      return request(app)
        .patch("/api/users")
        .set({ authorization: `Bearer ${adminUser.token}` })
        .send({ user_id: 3 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("patch 400: returns bad request if non valid patch request is made", () => {
      return request(app)
        .patch("/api/users")
        .set({ authorization: `Bearer ${adminUser.token}` })
        .send({ user_id: 3, role: "superduperadmin" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("patch 400: returns bad request if user_id is provided in wrong data type", () => {
      return request(app)
        .patch("/api/users")
        .set({ authorization: `Bearer ${adminUser.token}` })
        .send({ user_id: "three", role: "staff" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("PATCH 401: returns a not authenticated message if somebody who is not a user in the db tries to access the data", () => {
      return request(app)
        .patch("/api/users")
        .send({ user_id: 3, role: "staff" })
        .expect(401)
        .then(({ body }) => {
          expect(body.message).toBe("user not authenticated");
        });
    });
    test("PATCH 403: returns a not authorised message if a user tries to access the data", () => {
      return request(app)
        .patch("/api/users")
        .set({ authorization: `Bearer ${userUser.token}` })
        .send({ user_id: 3, role: "staff" })
        .expect(403)
        .then(({ body }) => {
          expect(body.message).toBe("unauthorised");
        });
    });
    test("PATCH 403: returns a not authorised message if a user tries to access the data", () => {
      return request(app)
        .patch("/api/users")
        .set({ authorization: `Bearer ${staffUser.token}` })
        .send({ user_id: 3, role: "staff" })
        .expect(403)
        .then(({ body }) => {
          expect(body.message).toBe("unauthorised");
        });
    });
  });
});

describe("EVENTS testing", () => {
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

  describe("GET all events", () => {
    test("GET 200: returns a list of all available events if a user attempts to access", () => {
      return request(app)
        .get("/api/events")
        .set({ authorization: `Bearer ${userUser.token}` })
        .expect(200)
        .then(({ body }) => {
          expect(body.events.length).toBe(5);
          body.events.forEach((event) => {
            expect(event).toMatchObject({
              event_id: expect.any(Number),
              event_title: expect.any(String),
              event_description: expect.any(String),
              host: expect.any(String),
              image: expect.any(String),
              location: expect.any(String),
              start_date: expect.any(String),
              end_date: expect.any(String),
              start_time: expect.any(String),
              end_time: expect.any(String),
              link: expect.any(String),
            });
          });
        });
    });
    test("GET 200: returns a list of all available events if a staff member attempts to access", () => {
      return request(app)
        .get("/api/events")
        .set({ authorization: `Bearer ${staffUser.token}` })
        .expect(200)
        .then(({ body }) => {
          expect(body.events.length).toBe(5);
          body.events.forEach((event) => {
            expect(event).toMatchObject({
              event_id: expect.any(Number),
              event_title: expect.any(String),
              event_description: expect.any(String),
              host: expect.any(String),
              image: expect.any(String),
              location: expect.any(String),
              start_date: expect.any(String),
              end_date: expect.any(String),
              start_time: expect.any(String),
              end_time: expect.any(String),
              link: expect.any(String),
            });
          });
        });
    });
    test("GET 200: returns a list of all available events if an admin attempts to access", () => {
      return request(app)
        .get("/api/events")
        .set({ authorization: `Bearer ${adminUser.token}` })
        .expect(200)
        .then(({ body }) => {
          expect(body.events.length).toBe(5);
          body.events.forEach((event) => {
            expect(event).toMatchObject({
              event_id: expect.any(Number),
              event_title: expect.any(String),
              event_description: expect.any(String),
              host: expect.any(String),
              image: expect.any(String),
              location: expect.any(String),
              start_date: expect.any(String),
              end_date: expect.any(String),
              start_time: expect.any(String),
              end_time: expect.any(String),
              link: expect.any(String),
            });
          });
        });
    });
    test("GET 401: if a user not in the db attempts to access the endpoint it returns a not authenticated message", () => {
      return request(app)
        .get("/api/events")
        .expect(401)
        .then(({ body }) => {
          expect(body.message).toBe("user not authenticated");
        });
    });
  });
  describe("GET event by event_id", () => {
    test("GET 200: returns the event associated with the id in addition to an extra key/value pair of number of attendees for a user", () => {
      return request(app)
        .get("/api/events/5")
        .set({ authorization: `Bearer ${userUser.token}` })
        .expect(200)
        .then(({ body }) => {
          expect(body.event).toMatchObject({
            event_id: 5,
            event_title: "Test event 5",
            event_description:
              "Lorem ipsum odor amet, consectetuer adipiscing elit. Convallis non nostra luctus semper tincidunt nam. Ad vestibulum cursus amet per vivamus congue per curabitur. Hendrerit faucibus pretium habitant; imperdiet potenti diam eleifend curae.",
            host: "test host 5",
            image:
              "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-b135bb1/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
            location: "test address 5",
            start_date: "19/02/2025",
            end_date: "19/02/2025",
            start_time: "20:00",
            end_time: "21:00",
            link: "www.genericeventwebsite5.com",
            number_of_attendees: 6,
          });
        });
    });
    test("GET 200: returns the event associated with the id in addition to an extra key/value pair of number of attendees for a staff member", () => {
      return request(app)
        .get("/api/events/5")
        .set({ authorization: `Bearer ${staffUser.token}` })
        .expect(200)
        .then(({ body }) => {
          expect(body.event).toMatchObject({
            event_id: 5,
            event_title: "Test event 5",
            event_description:
              "Lorem ipsum odor amet, consectetuer adipiscing elit. Convallis non nostra luctus semper tincidunt nam. Ad vestibulum cursus amet per vivamus congue per curabitur. Hendrerit faucibus pretium habitant; imperdiet potenti diam eleifend curae.",
            host: "test host 5",
            image:
              "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-b135bb1/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
            location: "test address 5",
            start_date: "19/02/2025",
            end_date: "19/02/2025",
            start_time: "20:00",
            end_time: "21:00",
            link: "www.genericeventwebsite5.com",
            number_of_attendees: 6,
          });
        });
    });
    test("GET 200: returns the event associated with the id in addition to an extra key/value pair of number of attendees for an admin", () => {
      return request(app)
        .get("/api/events/5")
        .set({ authorization: `Bearer ${adminUser.token}` })
        .expect(200)
        .then(({ body }) => {
          expect(body.event).toMatchObject({
            event_id: 5,
            event_title: "Test event 5",
            event_description:
              "Lorem ipsum odor amet, consectetuer adipiscing elit. Convallis non nostra luctus semper tincidunt nam. Ad vestibulum cursus amet per vivamus congue per curabitur. Hendrerit faucibus pretium habitant; imperdiet potenti diam eleifend curae.",
            host: "test host 5",
            image:
              "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-b135bb1/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
            location: "test address 5",
            start_date: "19/02/2025",
            end_date: "19/02/2025",
            start_time: "20:00",
            end_time: "21:00",
            link: "www.genericeventwebsite5.com",
            number_of_attendees: 6,
          });
        });
    });
    test("GET 400: returns a bad request if event_id provided as wrong datatype", () => {
      return request(app)
        .get("/api/events/five")
        .set({ authorization: `Bearer ${adminUser.token}` })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("GET 401: returns an unauthenticated message if a user not in the db tries to access the information", () => {
      return request(app)
        .get("/api/events/5")
        .expect(401)
        .then(({ body }) => {
          expect(body.message).toBe("user not authenticated");
        });
    });
    test("GET 404: returns event not found if no event currently exists with that id", () => {
      return request(app)
        .get("/api/events/36")
        .set({ authorization: `Bearer ${adminUser.token}` })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("event not found");
        });
    });
  });
  describe("POST event", () => {
    test("POST 200: returns the newly created event (if staff member only)", () => {
      return request(app)
        .post("/api/events")
        .set({ authorization: `Bearer ${staffUser.token}` })
        .send({
          event_title: "test suite title",
          event_description: "test suite event description",
          host: "test suite host",
          image:
            "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-b135bb1/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
          location: "test suite location",
          start_date: "13/02/2025",
          end_date: "13/02/2025",
          start_time: "17:00",
          end_time: "20:00",
          link: "test suite link",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.event).toMatchObject({
            event_id: 6,
            event_title: "test suite title",
            event_description: "test suite event description",
            host: "test suite host",
            image:
              "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-b135bb1/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
            location: "test suite location",
            start_date: "13/02/2025",
            end_date: "13/02/2025",
            start_time: "17:00",
            end_time: "20:00",
            link: "test suite link",
          });
        });
    });
    test("POST 200: returns the newly created event if no link is provided (if staff member only)", () => {
      return request(app)
        .post("/api/events")
        .set({ authorization: `Bearer ${staffUser.token}` })
        .send({
          event_title: "test suite title",
          event_description: "test suite event description",
          host: "test suite host",
          image:
            "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-b135bb1/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
          location: "test suite location",
          start_date: "13/02/2025",
          end_date: "13/02/2025",
          start_time: "17:00",
          end_time: "20:00",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.event).toMatchObject({
            event_id: 6,
            event_title: "test suite title",
            event_description: "test suite event description",
            host: "test suite host",
            image:
              "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-b135bb1/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
            location: "test suite location",
            start_date: "13/02/2025",
            end_date: "13/02/2025",
            start_time: "17:00",
            end_time: "20:00",
            link: null,
          });
        });
    });
    test("POST 200: returns the newly created event if admin ", () => {
      return request(app)
        .post("/api/events")
        .set({ authorization: `Bearer ${adminUser.token}` })
        .send({
          event_title: "test suite title",
          event_description: "test suite event description",
          host: "test suite host",
          image:
            "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-b135bb1/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
          location: "test suite location",
          start_date: "13/02/2025",
          end_date: "13/02/2025",
          start_time: "17:00",
          end_time: "20:00",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.event).toMatchObject({
            event_id: 6,
            event_title: "test suite title",
            event_description: "test suite event description",
            host: "test suite host",
            image:
              "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-b135bb1/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
            location: "test suite location",
            start_date: "13/02/2025",
            end_date: "13/02/2025",
            start_time: "17:00",
            end_time: "20:00",
            link: null,
          });
        });
    });
    test("POST 200: ignores any additional information in the request", () => {
      return request(app)
        .post("/api/events")
        .set({ authorization: `Bearer ${adminUser.token}` })
        .send({
          event_title: "test suite title",
          event_description: "test suite event description",
          host: "test suite host",
          image:
            "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-b135bb1/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
          location: "test suite location",
          start_date: "13/02/2025",
          end_date: "13/02/2025",
          start_time: "17:00",
          end_time: "20:00",
          i_dont_exist: "i don't exist",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.event).toMatchObject({
            event_id: 6,
            event_title: "test suite title",
            event_description: "test suite event description",
            host: "test suite host",
            image:
              "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-b135bb1/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
            location: "test suite location",
            start_date: "13/02/2025",
            end_date: "13/02/2025",
            start_time: "17:00",
            end_time: "20:00",
            link: null,
          });
          expect(body.event.hasOwnProperty("i_dont_exist")).toBe(false);
        });
    });
    test("POST 400: returns a bad request message if required information is missing in the request", () => {
      return request(app)
        .post("/api/events")
        .set({ authorization: `Bearer ${staffUser.token}` })
        .send({
          event_title: "test suite title",
          event_description: "test suite event description",
          host: "test suite host",
          image:
            "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-b135bb1/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
          location: "test suite location",
          end_date: "13/02/2025",
          start_time: "17:00",
          end_time: "20:00",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("POST 401: returns a not authenticated message when a user who is not registered is trying to make the request", () => {
      return request(app)
        .post("/api/events")
        .send({
          event_title: "test suite title",
          event_description: "test suite event description",
          host: "test suite host",
          image:
            "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-b135bb1/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
          location: "test suite location",
          start_date: "13/02/2025",
          end_date: "13/02/2025",
          start_time: "17:00",
          end_time: "20:00",
        })
        .expect(401)
        .then(({ body }) => {
          expect(body.message).toBe("user not authenticated");
        });
    });
    test("POST 403: returns a not authorised message when a user is trying to make the request", () => {
      return request(app)
        .post("/api/events")
        .set({ authorization: `Bearer ${userUser.token}` })
        .send({
          event_title: "test suite title",
          event_description: "test suite event description",
          host: "test suite host",
          image:
            "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-b135bb1/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
          location: "test suite location",
          start_date: "13/02/2025",
          end_date: "13/02/2025",
          start_time: "17:00",
          end_time: "20:00",
        })
        .expect(403)
        .then(({ body }) => {
          expect(body.message).toBe("unauthorised");
        });
    });
  });
});
