const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config();

const app = require("../../app");
const { User } = require("../../model/user");

const { DB_TEST_HOST } = process.env;

describe("test auth", () => {
  let server;
  beforeAll(() => (server = app.listen(3000)));
  afterAll(() => server.close());

  beforeEach((done) => {
    mongoose.connect(DB_TEST_HOST).then(() => done());
  });

  afterEach((done) => {
    mongoose.connection.db.dropCollection("users").then(() => {
      mongoose.connection.close(() => done());
    });
  });

  test("test register route", async () => {
    const registerData = {
      email: "11566svev@gmail.com",
      subscription: "starter",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(registerData);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Register success");

    const user = await User.findById(response.body._id);
    expect(user).toByThruthy();
    expect(user.email).toBe(registerData.email);
    expect(user.subscription).toBe(registerData.subscription);
  });
});
