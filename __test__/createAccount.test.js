const request = require("supertest");
const app = require("../app"); // assuming your index.js file exports the Express app
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });
  
  describe("POST /api/auth/createAccount", () => {
    afterEach(async () => {
      await User.deleteMany({});
    });
  
    test("should create a new user when given valid information", async () => {
      const validUser = {
        firstName: "John",
        email: "test@example.com",
        password: "password123",
      };
      const response = await request(app)
        .post("/api/auth/createAccount")
        .send(validUser)
        .expect(200);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.firstName).toBe(validUser.firstName);
      expect(response.body.email).toBe(validUser.email);
    });
  
    test("should respond with a 409 error when the user already exists", async () => {
      const existingUser = new User({
        firstName: "Jane",
        email: "existing@example.com",
        password: "password123",
      });
      await existingUser.save();
      const response = await request(app)
        .post("/api/auth/createAccount")
        .send({
          firstName: "John",
          email: "existing@example.com",
          password: "password123",
        })
        .expect(409);
      expect(response.text).toBe("User already exists");
    });
  
    test("should respond with a 400 error when the firstName field is empty", async () => {
      const response = await request(app)
        .post("/api/auth/createAccount")
        .send({
          firstName: "",
          email: "test@example.com",
          password: "password123",
        })
        .expect(400);
      expect(response.text).toBe("FirstName is required");
    });
  
    test("should respond with a 400 error when the email field is empty", async () => {
      const response = await request(app)
        .post("/api/auth/createAccount")
        .send({
          firstName: "John",
          email: "",
          password: "password123",
        })
        .expect(400);
      expect(response.text).toBe("Email is required");
    });
  
    test("should respond with a 400 error when the password field is empty", async () => {
      const response = await request(app)
        .post("/api/auth/createAccount")
        .send({
          firstName: "John",
          email: "test@example.com",
          password: "",
        })
        .expect(400);
      expect(response.text).toBe("Password is required");
    });
  });