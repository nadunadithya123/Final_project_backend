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
  
  describe("POST /api/auth/login", () => {
    let user;
    const validUser = {
      email: "test@example.com",
      password: "password123",
    };
    beforeAll(async () => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(validUser.password, salt);
      user = new User({
        email: validUser.email,
        password: hashedPassword,
      });
      await user.save();
    });
  
    afterAll(async () => {
      await User.deleteMany({});
    });
  
    test("should respond with a token and user object when given valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send(validUser)
        .expect(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
    });
  
    test("should respond with a 404 error when given an email that does not exist", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: validUser.password,
        })
        .expect(404);
      expect(response.text).toBe("User does not exist");
    });
  
    test("should respond with a 400 error when given an incorrect password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: validUser.email,
          password: "wrongpassword",
        })
        .expect(400);
      expect(response.body.errors[0].msg).toBe("Invalid Credentials");
    });
  
    test("should respond with a 400 error when the email field is empty", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "",
          password: validUser.password,
        })
        .expect(400);
      expect(response.text).toBe("Email is required");
    });
  
    test("should respond with a 400 error when the password field is empty", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: validUser.email,
          password: "",
        })
        .expect(400);
      expect(response.text).toBe("Password is required");
    });
  });